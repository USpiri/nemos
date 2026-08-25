import { open } from '@tauri-apps/plugin-dialog'

/**
 * Opens the native folder picker so the user can select any folder on disk
 * as the active Root (#85). Selecting a folder here is what grants Tauri's
 * runtime fs scope for it (via the dialog plugin, not a capability entry) —
 * `recursive: true` matches the whole-subtree access a Root needs.
 *
 * Returns the picked folder's absolute path, or null if the user cancelled.
 */
export const openFolderDialog = async (): Promise<string | null> => {
  return open({ directory: true, multiple: false, recursive: true })
}
