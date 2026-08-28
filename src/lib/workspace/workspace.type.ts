import { DirEntry } from '@tauri-apps/plugin-fs'

export type WorkspaceEntry = DirEntry & {
  path: string
}

export type DetailedWorkspaceEntry = WorkspaceEntry & {
  modified?: Date | null
}

/**
 * A pinned Workspace entry in the registry (#86) — a bookmark to a Root,
 * keyed by its absolute `path`. `name` defaults to the folder's basename on
 * pin but is independently editable, so it is never derived from `path`.
 */
export type WorkspacePin = {
  name: string
  path: string
}
