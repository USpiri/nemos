import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceRegistry } from './workspace-registry'

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

describe('useWorkspaceRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSet.mockResolvedValue(undefined)
    mockSave.mockResolvedValue(undefined)
    mockGet.mockResolvedValue(undefined)
    useWorkspaceRegistry.setState({ workspaces: [], _initialized: false })
  })

  describe('init()', () => {
    it('loads persisted pins into state', async () => {
      mockGet.mockResolvedValue([{ name: 'Personal', path: '/roots/personal' }])

      await useWorkspaceRegistry.getState().init()

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'Personal', path: '/roots/personal' },
      ])
    })

    it('defaults to an empty list when nothing is persisted', async () => {
      mockGet.mockResolvedValue(undefined)

      await useWorkspaceRegistry.getState().init()

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([])
    })

    it('defaults to an empty list when the persisted value is malformed', async () => {
      mockGet.mockResolvedValue({ not: 'an array' })

      await useWorkspaceRegistry.getState().init()

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([])
    })

    it('only reads from the store once across repeated calls', async () => {
      mockGet.mockResolvedValue([])

      await useWorkspaceRegistry.getState().init()
      await useWorkspaceRegistry.getState().init()

      expect(mockGet).toHaveBeenCalledTimes(1)
    })
  })

  describe('pin()', () => {
    it('adds an entry defaulting name to the folder basename', async () => {
      await useWorkspaceRegistry
        .getState()
        .pin('/Users/x/Documents/nemos-app/personal')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/Users/x/Documents/nemos-app/personal' },
      ])
    })

    it('persists the updated list to the store', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')

      expect(mockSet).toHaveBeenCalledWith('workspaceRegistry', [
        { name: 'personal', path: '/roots/personal' },
      ])
      expect(mockSave).toHaveBeenCalled()
    })

    it('throws and does not create a second entry when the path is already pinned', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      mockSet.mockClear()

      await expect(
        useWorkspaceRegistry.getState().pin('/roots/personal'),
      ).rejects.toMatchObject({ code: 'ALREADY_PINNED' })

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/roots/personal' },
      ])
      expect(mockSet).not.toHaveBeenCalled()
    })

    it('names the entry with the given display name instead of the basename', async () => {
      await useWorkspaceRegistry
        .getState()
        .pin('/Users/x/Documents/nemos-app/personal', 'My Notes')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'My Notes', path: '/Users/x/Documents/nemos-app/personal' },
      ])
    })

    it('names the already-pinned error after the existing entry', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal', 'My Notes')

      await expect(
        useWorkspaceRegistry.getState().pin('/roots/personal'),
      ).rejects.toMatchObject({
        code: 'ALREADY_PINNED',
        message: "This folder is already a workspace named 'My Notes'",
      })
    })
  })

  describe('unpin()', () => {
    it('removes only the matching entry', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      await useWorkspaceRegistry.getState().pin('/roots/work')

      await useWorkspaceRegistry.getState().unpin('/roots/personal')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'work', path: '/roots/work' },
      ])
    })

    it('persists the updated list without touching the filesystem', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      mockSet.mockClear()
      mockSave.mockClear()

      await useWorkspaceRegistry.getState().unpin('/roots/personal')

      expect(mockSet).toHaveBeenCalledWith('workspaceRegistry', [])
      expect(mockSave).toHaveBeenCalled()
    })

    it('is a no-op when the path is not pinned', async () => {
      await useWorkspaceRegistry.getState().unpin('/roots/missing')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([])
    })
  })

  describe('rename()', () => {
    it('changes only the name, leaving the path untouched', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')

      await useWorkspaceRegistry
        .getState()
        .rename('/roots/personal', 'My Notes')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'My Notes', path: '/roots/personal' },
      ])
    })

    it('persists the renamed entry', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      mockSet.mockClear()

      await useWorkspaceRegistry
        .getState()
        .rename('/roots/personal', 'My Notes')

      expect(mockSet).toHaveBeenCalledWith('workspaceRegistry', [
        { name: 'My Notes', path: '/roots/personal' },
      ])
    })

    it('does not affect other entries', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      await useWorkspaceRegistry.getState().pin('/roots/work')

      await useWorkspaceRegistry
        .getState()
        .rename('/roots/personal', 'My Notes')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'My Notes', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])
    })
  })

  describe('relocate()', () => {
    it('changes only the path, leaving the name untouched', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')

      await useWorkspaceRegistry
        .getState()
        .relocate('/roots/personal', '/roots/personal-moved')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/roots/personal-moved' },
      ])
    })

    it('persists the relocated entry', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      mockSet.mockClear()

      await useWorkspaceRegistry
        .getState()
        .relocate('/roots/personal', '/roots/personal-moved')

      expect(mockSet).toHaveBeenCalledWith('workspaceRegistry', [
        { name: 'personal', path: '/roots/personal-moved' },
      ])
    })

    it('does not affect other entries', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      await useWorkspaceRegistry.getState().pin('/roots/work')

      await useWorkspaceRegistry
        .getState()
        .relocate('/roots/personal', '/roots/personal-moved')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/roots/personal-moved' },
        { name: 'work', path: '/roots/work' },
      ])
    })

    it('throws and does not relocate when the new path is already pinned by another entry', async () => {
      await useWorkspaceRegistry.getState().pin('/roots/personal')
      await useWorkspaceRegistry.getState().pin('/roots/work')
      mockSet.mockClear()

      await expect(
        useWorkspaceRegistry.getState().relocate('/roots/personal', '/roots/work'),
      ).rejects.toMatchObject({
        code: 'ALREADY_PINNED',
        message: "This folder is already a workspace named 'work'",
      })

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([
        { name: 'personal', path: '/roots/personal' },
        { name: 'work', path: '/roots/work' },
      ])
      expect(mockSet).not.toHaveBeenCalled()
    })

    it('is a no-op when the path is not pinned', async () => {
      await useWorkspaceRegistry
        .getState()
        .relocate('/roots/missing', '/roots/missing-moved')

      expect(useWorkspaceRegistry.getState().workspaces).toEqual([])
    })
  })
})
