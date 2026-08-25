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

const ROOT = '/root/test'

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
      await scope.getState().init(ROOT)

      expect(scope.getState().theme).toBe('dark')

      await scope.getState().resetToDefaults()

      expect(scope.getState().theme).toBe('system')
      expect(scope.getState().value).toBe(0)
    })

    it('persists defaults to global store', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      mockSet.mockClear()
      mockSave.mockClear()

      await scope.getState().resetToDefaults()

      expect(mockSet).toHaveBeenCalledWith('test', {
        _meta: { version: 1 },
        data: testDef.defaults,
      })
      expect(mockSave).toHaveBeenCalled()
    })

    it("clears the scope's root delta so re-init does not re-apply stale overrides", async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light' } }) // init: root delta
        .mockResolvedValueOnce({ test: { theme: 'light' } }) // resetToDefaults: removeRootDelta read

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      await scope.getState().resetToDefaults()

      expect(mockWriteJson).toHaveBeenLastCalledWith(
        `${ROOT}/.config/settings.json`,
        {},
      )
    })
  })

  describe('rootDelta', () => {
    it('is empty before init', () => {
      const scope = createScope(testDef)
      expect(scope.getState().rootDelta).toEqual({})
    })

    it('reflects loaded root delta after init', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({ test: { theme: 'light' } })

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)

      expect(scope.getState().rootDelta).toEqual({ theme: 'light' })
    })

    it('is empty after reset()', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } })
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } })

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      await scope.getState().reset()

      expect(scope.getState().rootDelta).toEqual({})
    })

    it('accumulates keys from update() into rootDelta', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)

      await scope.getState().update({ theme: 'light' })
      expect(scope.getState().rootDelta).toEqual({ theme: 'light' })

      await scope.getState().update({ value: 99 })
      expect(scope.getState().rootDelta).toEqual({ theme: 'light', value: 99 })
    })
  })

  describe('revertKey()', () => {
    it('removes the key from rootDelta in state', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({ test: { theme: 'light', value: 99 } })

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)

      await scope.getState().revertKey('theme')

      expect(scope.getState().rootDelta).toEqual({ value: 99 })
    })

    it('reverts state for that key to the global value', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({ test: { theme: 'light', value: 99 } })

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)

      expect(scope.getState().theme).toBe('light')
      await scope.getState().revertKey('theme')
      expect(scope.getState().theme).toBe('dark')
    })

    it('persists the delta file without that key', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } }) // init
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 }, other: { x: 1 } }) // revertKey read

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      await scope.getState().revertKey('theme')

      expect(mockWriteJson).toHaveBeenLastCalledWith(
        `${ROOT}/.config/settings.json`,
        { test: { value: 99 }, other: { x: 1 } },
      )
    })
  })

  describe('reset()', () => {
    it('reverts effective state to global settings', async () => {
      const globalData = { theme: 'dark', value: 5 }
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: globalData })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } }) // init: root delta
        .mockResolvedValueOnce({ test: { theme: 'light', value: 99 } }) // reset: read file

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)

      expect(scope.getState().theme).toBe('light')

      await scope.getState().reset()

      expect(scope.getState().theme).toBe('dark')
      expect(scope.getState().value).toBe(5)
    })

    it("removes the scope's key from the root delta file", async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson
        .mockResolvedValueOnce({ test: { theme: 'light' }, other: { x: 1 } }) // init
        .mockResolvedValueOnce({ test: { theme: 'light' }, other: { x: 1 } }) // reset

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      await scope.getState().reset()

      expect(mockWriteJson).toHaveBeenLastCalledWith(
        `${ROOT}/.config/settings.json`,
        { other: { x: 1 } },
      )
    })

    it('does not modify global settings', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({})

      const scope = createScope(testDef)
      await scope.getState().init(ROOT)
      mockSet.mockClear()

      await scope.getState().reset()

      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('migrateRootDelta', () => {
    type TestDelta = Partial<{ theme: string; value: number }> & {
      legacyKey?: string
    }
    const migratingDef = {
      ...testDef,
      migrateRootDelta: (raw: TestDelta) => {
        if (raw.legacyKey === undefined) return raw
        const { legacyKey, ...rest } = raw
        return { ...rest, theme: legacyKey }
      },
    }

    it('leaves the delta untouched when no legacy key is present', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({ test: { theme: 'light' } })

      const scope = createScope(migratingDef)
      await scope.getState().init(ROOT)

      expect(scope.getState().rootDelta).toEqual({ theme: 'light' })
      expect(mockWriteJson).not.toHaveBeenCalled()
    })

    it('applies the rename and persists the migrated delta once', async () => {
      mockGet.mockResolvedValue({ _meta: { version: 1 }, data: { theme: 'dark', value: 5 } })
      mockReadJson.mockResolvedValue({ test: { legacyKey: 'light' } })

      const scope = createScope(migratingDef)
      await scope.getState().init(ROOT)

      expect(scope.getState().theme).toBe('light')
      expect(scope.getState().rootDelta).toEqual({ theme: 'light' })
      expect(mockWriteJson).toHaveBeenCalledWith(`${ROOT}/.config/settings.json`, {
        test: { theme: 'light' },
      })
    })
  })
})
