import { z } from 'zod'
import { create } from 'zustand'
import { rootFolderName } from '@/lib/paths'
import { store } from '@/lib/settings'
import { WorkspaceError } from './errors'
import type { WorkspacePin } from './workspace.type'

const REGISTRY_KEY = 'workspaceRegistry'

const workspacePinSchema = z.object({
  name: z.string(),
  path: z.string(),
})
const workspaceRegistrySchema = z.array(workspacePinSchema)

interface WorkspaceRegistryState {
  workspaces: WorkspacePin[]
  _initialized: boolean
  init: () => Promise<void>
  pin: (path: string) => Promise<void>
  unpin: (path: string) => Promise<void>
  rename: (path: string, name: string) => Promise<void>
}

const persistWorkspaces = async (workspaces: WorkspacePin[]) => {
  await store.set(REGISTRY_KEY, workspaces)
  await store.save()
}

/**
 * The Workspace pin registry (#86) — a small, cross-Root bookmark list kept
 * as its own top-level key in the global settings `LazyStore`, not routed
 * through the per-Root settings-delta mechanism (`createScope`) since pins
 * aren't scoped to any single Root.
 */
export const useWorkspaceRegistry = create<WorkspaceRegistryState>()(
  (set, get) => ({
    workspaces: [],
    _initialized: false,

    init: async () => {
      if (get()._initialized) return

      const stored = await store.get<unknown>(REGISTRY_KEY)
      const parsed = workspaceRegistrySchema.safeParse(stored)

      set({ workspaces: parsed.success ? parsed.data : [], _initialized: true })
    },

    pin: async (path) => {
      const { workspaces } = get()
      if (workspaces.some((workspace) => workspace.path === path)) {
        throw new WorkspaceError(
          'ALREADY_PINNED',
          'This folder is already pinned as a Workspace',
        )
      }

      const next = [...workspaces, { name: rootFolderName(path), path }]
      set({ workspaces: next })
      await persistWorkspaces(next)
    },

    unpin: async (path) => {
      const next = get().workspaces.filter(
        (workspace) => workspace.path !== path,
      )
      set({ workspaces: next })
      await persistWorkspaces(next)
    },

    rename: async (path, name) => {
      const next = get().workspaces.map((workspace) =>
        workspace.path === path ? { ...workspace, name } : workspace,
      )
      set({ workspaces: next })
      await persistWorkspaces(next)
    },
  }),
)
