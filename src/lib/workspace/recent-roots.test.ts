import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecentRoots } from './recent-roots'

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

describe('useRecentRoots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSet.mockResolvedValue(undefined)
    mockSave.mockResolvedValue(undefined)
    mockGet.mockResolvedValue(undefined)
    useRecentRoots.setState({
      recents: [],
      _initialized: false,
      _initPromise: null,
    })
  })

  describe('init()', () => {
    it('loads persisted entries into state', async () => {
      mockGet.mockResolvedValue([{ path: '/roots/personal', lastOpenedAt: 1 }])

      await useRecentRoots.getState().init()

      expect(useRecentRoots.getState().recents).toEqual([
        { path: '/roots/personal', lastOpenedAt: 1 },
      ])
    })

    it('defaults to an empty list when nothing is persisted', async () => {
      mockGet.mockResolvedValue(undefined)

      await useRecentRoots.getState().init()

      expect(useRecentRoots.getState().recents).toEqual([])
    })

    it('defaults to an empty list when the persisted value is malformed', async () => {
      mockGet.mockResolvedValue({ not: 'an array' })

      await useRecentRoots.getState().init()

      expect(useRecentRoots.getState().recents).toEqual([])
    })

    it('only reads from the store once across repeated calls', async () => {
      mockGet.mockResolvedValue([])

      await useRecentRoots.getState().init()
      await useRecentRoots.getState().init()

      expect(mockGet).toHaveBeenCalledTimes(1)
    })

    it('only reads from the store once when called concurrently before it resolves', async () => {
      let resolveGet: (value: unknown) => void
      mockGet.mockReturnValue(
        new Promise((resolve) => {
          resolveGet = resolve
        }),
      )

      const calls = Promise.all([
        useRecentRoots.getState().init(),
        useRecentRoots.getState().init(),
      ])
      resolveGet!([{ path: '/roots/personal', lastOpenedAt: 1 }])
      await calls

      expect(mockGet).toHaveBeenCalledTimes(1)
      expect(useRecentRoots.getState().recents).toEqual([
        { path: '/roots/personal', lastOpenedAt: 1 },
      ])
    })
  })

  describe('recordOpen()', () => {
    it('adds a new entry to the front of the list', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')

      const [entry] = useRecentRoots.getState().recents
      expect(entry.path).toBe('/roots/personal')
      expect(typeof entry.lastOpenedAt).toBe('number')
    })

    it('persists the updated list to the store', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')

      expect(mockSet).toHaveBeenCalledWith(
        'recentRoots',
        useRecentRoots.getState().recents,
      )
      expect(mockSave).toHaveBeenCalled()
    })

    it('initializes from persisted state before recording, instead of clobbering it', async () => {
      mockGet.mockResolvedValue([{ path: '/roots/existing', lastOpenedAt: 1 }])

      await useRecentRoots.getState().recordOpen('/roots/personal')

      expect(useRecentRoots.getState().recents.map((r) => r.path)).toEqual([
        '/roots/personal',
        '/roots/existing',
      ])
    })

    it('bumps an already-recent path to the front instead of duplicating it', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')
      await useRecentRoots.getState().recordOpen('/roots/work')
      await useRecentRoots.getState().recordOpen('/roots/personal')

      const recents = useRecentRoots.getState().recents
      expect(recents.map((r) => r.path)).toEqual([
        '/roots/personal',
        '/roots/work',
      ])
    })

    it('updates lastOpenedAt when bumping an existing entry', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')
      const firstOpenedAt = useRecentRoots.getState().recents[0].lastOpenedAt

      vi.useFakeTimers()
      vi.advanceTimersByTime(1000)
      await useRecentRoots.getState().recordOpen('/roots/personal')
      vi.useRealTimers()

      expect(useRecentRoots.getState().recents[0].lastOpenedAt).toBeGreaterThan(
        firstOpenedAt,
      )
    })

    it('gives a pinned path opened repeatedly exactly one Recent slot', async () => {
      await useRecentRoots.getState().recordOpen('/roots/pinned')
      await useRecentRoots.getState().recordOpen('/roots/pinned')
      await useRecentRoots.getState().recordOpen('/roots/pinned')

      expect(useRecentRoots.getState().recents).toHaveLength(1)
    })

    it('caps the list at 10 entries, evicting the oldest tail entry', async () => {
      for (let i = 0; i < 10; i++) {
        await useRecentRoots.getState().recordOpen(`/roots/${i}`)
      }

      await useRecentRoots.getState().recordOpen('/roots/10')

      const paths = useRecentRoots.getState().recents.map((r) => r.path)
      expect(paths).toHaveLength(10)
      expect(paths[0]).toBe('/roots/10')
      expect(paths).not.toContain('/roots/0')
    })
  })

  describe('remove()', () => {
    it('removes only the matching entry', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')
      await useRecentRoots.getState().recordOpen('/roots/work')

      await useRecentRoots.getState().remove('/roots/personal')

      expect(useRecentRoots.getState().recents.map((r) => r.path)).toEqual([
        '/roots/work',
      ])
    })

    it('persists the updated list', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')
      mockSet.mockClear()
      mockSave.mockClear()

      await useRecentRoots.getState().remove('/roots/personal')

      expect(mockSet).toHaveBeenCalledWith('recentRoots', [])
      expect(mockSave).toHaveBeenCalled()
    })

    it('initializes from persisted state before removing, instead of clobbering it', async () => {
      mockGet.mockResolvedValue([
        { path: '/roots/a', lastOpenedAt: 1 },
        { path: '/roots/b', lastOpenedAt: 2 },
      ])

      await useRecentRoots.getState().remove('/roots/a')

      expect(useRecentRoots.getState().recents).toEqual([
        { path: '/roots/b', lastOpenedAt: 2 },
      ])
    })

    it('is a no-op when the path is not in the list', async () => {
      await useRecentRoots.getState().recordOpen('/roots/personal')

      await useRecentRoots.getState().remove('/roots/missing')

      expect(useRecentRoots.getState().recents).toHaveLength(1)
    })
  })
})
