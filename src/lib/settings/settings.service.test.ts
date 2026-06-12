import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { createScope } from './settings.service'

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

const { mockReadJson, mockWriteJson, mockEnsureDir } = vi.hoisted(() => ({
  mockReadJson: vi.fn(),
  mockWriteJson: vi.fn(),
  mockEnsureDir: vi.fn(),
}))

vi.mock('@/lib/fs', () => ({
  readJson: mockReadJson,
  writeJson: mockWriteJson,
  ensureDir: mockEnsureDir,
}))

const TestSchema = z.object({ theme: z.string(), value: z.number() })
const testDef = {
  key: 'test',
  version: 1,
  schema: TestSchema,
  defaults: { theme: 'system', value: 0 },
}

const WORKSPACE = '/workspace/test'

describe('createScope', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSave.mockResolvedValue(undefined)
    mockSet.mockResolvedValue(undefined)
    mockEnsureDir.mockResolvedValue(undefined)
    mockWriteJson.mockResolvedValue(undefined)
  })

  describe('resetToDefaults()', () => {
    it('sets state to hardcoded defaults', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)

      expect(scope.getState().theme).toBe('dark')

      await scope.getState().resetToDefaults()

      expect(scope.getState().theme).toBe('system')
      expect(scope.getState().value).toBe(0)
    })

    it('persists defaults to global store', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)
      mockSet.mockClear()
      mockSave.mockClear()

      await scope.getState().resetToDefaults()

      expect(mockSet).toHaveBeenCalledWith('test', {
        _meta: { version: 1 },
        data: testDef.defaults,
      })
      expect(mockSave).toHaveBeenCalled()
    })

    it("clears the scope's workspace delta so re-init does not re-apply stale overrides", async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light' } }) // init: workspace delta
        .mockResolvedValueOnce({ test: { theme: 'light' } }) // resetToDefaults: removeWorkspaceDelta read

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)
      await scope.getState().resetToDefaults()

      expect(mockWriteJson).toHaveBeenLastCalledWith(
        `${WORKSPACE}/.config/settings.json`,
        {},
      )
    })
  })

  describe('reset()', () => {
    it('reverts effective state to global settings', async () => {
      const globalData = { theme: 'dark', value: 5 }
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: globalData })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } }) // init: workspace delta
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } }) // reset: read file

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)

      expect(scope.getState().theme).toBe('light')

      await scope.getState().reset()

      expect(scope.getState().theme).toBe('dark')
      expect(scope.getState().value).toBe(5)
    })

    it("removes the scope's key from the workspace delta file", async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light' }, other: { x: 1 } }) // init
        .mockResolvedValueOnce({ test: { theme: 'light' }, other: { x: 1 } }) // reset

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)
      await scope.getState().reset()

      expect(mockWriteJson).toHaveBeenLastCalledWith(
        `${WORKSPACE}/.config/settings.json`,
        { other: { x: 1 } },
      )
    })

    it('does not modify global settings', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(WORKSPACE)
      mockSet.mockClear()

      await scope.getState().reset()

      expect(mockSet).not.toHaveBeenCalled()
    })
  })
})
