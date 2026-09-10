import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceRegistry } from '../workspace-registry'
import {
  acceptPinsMigration,
  checkPinsMigration,
  declinePinsMigration,
} from './migrate-pins'

const { mockGet, mockSet, mockSave } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
  mockSave: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-store', () => ({
  LazyStore: vi.fn(function () {
    return { get: mockGet, set: mockSet, save: mockSave }
  }),
}))

const { mockReadDir } = vi.hoisted(() => ({ mockReadDir: vi.fn() }))
vi.mock('@/lib/fs', () => ({ readDir: mockReadDir }))

const { mockJoin, mockDocumentDir } = vi.hoisted(() => ({
  mockJoin: vi.fn(),
  mockDocumentDir: vi.fn(),
}))
vi.mock('@tauri-apps/api/path', () => ({
  join: mockJoin,
  documentDir: mockDocumentDir,
}))

const dirEntry = (name: string) => ({
  name,
  isDirectory: true,
  isFile: false,
  isSymlink: false,
})
const fileEntry = (name: string) => ({
  name,
  isDirectory: false,
  isFile: true,
  isSymlink: false,
})

describe('migrate-pins', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockGet.mockResolvedValue(undefined)
    mockSet.mockResolvedValue(undefined)
    mockSave.mockResolvedValue(undefined)
    mockDocumentDir.mockResolvedValue('C:/Users/x/Documents')
    mockJoin.mockImplementation((...parts: string[]) =>
      Promise.resolve(parts.join('/')),
    )
    useWorkspaceRegistry.setState({ workspaces: [], _initialized: false })
  })

  describe('checkPinsMigration()', () => {
    it('returns null without scanning when the prompt has already been answered', async () => {
      mockGet.mockResolvedValue(true)

      const result = await checkPinsMigration()

      expect(result).toBeNull()
      expect(mockReadDir).not.toHaveBeenCalled()
    })

    it('returns candidate subdirectories, named by folder basename, when unanswered', async () => {
      mockReadDir.mockResolvedValue([dirEntry('personal'), dirEntry('work')])

      const result = await checkPinsMigration()

      expect(result).toEqual([
        { name: 'personal', path: 'C:/Users/x/Documents/nemos-app/personal' },
        { name: 'work', path: 'C:/Users/x/Documents/nemos-app/work' },
      ])
    })

    it('excludes files and hidden directories from the candidate list', async () => {
      mockReadDir.mockResolvedValue([
        dirEntry('.config'),
        fileEntry('note.md'),
        dirEntry('personal'),
      ])

      const result = await checkPinsMigration()

      expect(result).toEqual([
        { name: 'personal', path: 'C:/Users/x/Documents/nemos-app/personal' },
      ])
    })

    it('auto-resolves as answered with nothing to migrate, without prompting', async () => {
      mockReadDir.mockResolvedValue([])

      const result = await checkPinsMigration()

      expect(result).toBeNull()
      expect(mockSet).toHaveBeenCalledWith('pinsMigrationPrompted', true)
      expect(mockSave).toHaveBeenCalled()
    })

    it('propagates a scan failure instead of treating it as nothing to migrate', async () => {
      mockReadDir.mockRejectedValue(new Error('permission denied'))

      await expect(checkPinsMigration()).rejects.toThrow('permission denied')
      expect(mockSet).not.toHaveBeenCalledWith('pinsMigrationPrompted', true)
    })
  })

  describe('acceptPinsMigration()', () => {
    it('pins every candidate with its given name', async () => {
      await acceptPinsMigration([
        { name: 'personal', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])
    })

    it('marks the prompt answered so it never reappears', async () => {
      await acceptPinsMigration([{ name: 'personal', path: '/roots/personal' }])

      expect(mockSet).toHaveBeenCalledWith('pinsMigrationPrompted', true)
      expect(mockSave).toHaveBeenCalled()
    })

    it('initializes the registry from persisted state before pinning, instead of clobbering it', async () => {
      mockGet.mockResolvedValue([{ name: 'Existing', path: '/roots/existing' }])

      await acceptPinsMigration([{ name: 'personal', path: '/roots/personal' }])

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'Existing', path: '/roots/existing' },
        { name: 'personal', path: '/roots/personal' },
      ])
    })

    it('skips a candidate that is already pinned instead of failing the batch', async () => {
      useWorkspaceRegistry.setState({
        workspaces: [{ name: 'Personal', path: '/roots/personal' }],
        _initialized: true,
      })

      await acceptPinsMigration([
        { name: 'personal', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'Personal', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])
    })
  })

  describe('declinePinsMigration()', () => {
    it('marks the prompt answered without pinning anything', async () => {
      await declinePinsMigration()

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([])
      expect(mockSet).toHaveBeenCalledWith('pinsMigrationPrompted', true)
      expect(mockSave).toHaveBeenCalled()
    })
  })
})
