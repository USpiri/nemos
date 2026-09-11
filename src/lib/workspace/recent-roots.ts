import { z } from 'zod'
import { create } from 'zustand'
import { RECENT_ROOTS_LIMIT } from '@/config/constants'
import { store } from '@/lib/settings'
import type { RecentRoot } from './workspace.type'

const RECENTS_KEY = 'recentRoots'

const recentRootSchema = z.object({
  path: z.string(),
  lastOpenedAt: z.number(),
})
const recentRootsSchema = z.array(recentRootSchema)

interface RecentRootsState {
  recents: RecentRoot[]
  _initialized: boolean
  _initPromise: Promise<void> | null
  init: () => Promise<void>
  recordOpen: (path: string) => Promise<void>
  remove: (path: string) => Promise<void>
}

const persistRecents = async (recents: RecentRoot[]) => {
  await store.set(RECENTS_KEY, recents)
  await store.save()
}

/**
 * The Recent Roots MRU list (#88) — a separate top-level key in the global
 * settings `LazyStore`, deliberately unaware of Workspace pin status: every
 * Root open (pinned or not) upserts/bumps its entry here, so a path can
 * appear in both the pin registry and this list at the same time.
 *
 * `recordOpen`/`remove` initialize from the persisted store on first call
 * (rather than requiring callers to `init()` up front, as the pin registry
 * does) because they can fire from the `/workspace/$rootPath` route loader
 * on a cold app start — before anything else has read this store — and
 * mutating from empty in-memory state would clobber what's on disk.
 */
export const useRecentRoots = create<RecentRootsState>()((set, get) => ({
  recents: [],
  _initialized: false,
  _initPromise: null,

  init: async () => {
    if (get()._initialized) return

    let promise = get()._initPromise
    if (!promise) {
      promise = (async () => {
        const stored = await store.get<unknown>(RECENTS_KEY)
        const parsed = recentRootsSchema.safeParse(stored)

        set({ recents: parsed.success ? parsed.data : [], _initialized: true })
      })()
      set({ _initPromise: promise })
    }

    await promise
  },

  // Drops any existing entry for `path` before re-adding it at the front,
  // so a pinned Workspace opened repeatedly still occupies exactly one
  // Recent slot rather than accumulating duplicates.
  recordOpen: async (path) => {
    await get().init()

    const rest = get().recents.filter((recent) => recent.path !== path)
    const next = [{ path, lastOpenedAt: Date.now() }, ...rest].slice(
      0,
      RECENT_ROOTS_LIMIT,
    )
    set({ recents: next })
    await persistRecents(next)
  },

  remove: async (path) => {
    await get().init()

    const next = get().recents.filter((recent) => recent.path !== path)
    set({ recents: next })
    await persistRecents(next)
  },
}))
