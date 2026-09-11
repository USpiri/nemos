import { documentDir, join } from '@tauri-apps/api/path'
import {
  DEFAULT_FOLDER_NAME,
  DEFAULT_NOTE_NAME,
  EXTENSION,
  ROOT,
} from '@/config/constants'

// ── Filesystem paths (used only at the fs layer) ──────────────────────────────

/**
 * Returns a Root's absolute path, or a path inside it, given the Root's own
 * absolute path (per #85, a Root can live anywhere on disk — not just under
 * ROOT — so this joins onto whatever absolute path it's given rather than
 * reconstructing one from ROOT).
 *
 * Example:
 * - "C:/Users/x/Documents/nemos-app/personal" → same, unchanged
 * - "C:/Users/x/Documents/nemos-app/personal", "folder/note.md" →
 *   "C:/Users/x/Documents/nemos-app/personal/folder/note.md"
 */
export const toFsPath = (rootPath: string, relativePath = ''): string =>
  relativePath ? `${rootPath}/${relativePath}` : rootPath

// ── Relative path extraction ──────────────────────────────────────────────────

/**
 * Strips a Root's absolute path prefix from one of its fsPaths (produced by
 * toFsPath, or by recursively walking the Root) → relativePath.
 *
 * Example:
 * - "C:/.../personal/folder/note.md", "C:/.../personal" → "folder/note.md"
 * - "C:/.../personal/folder", "C:/.../personal" → "folder"
 * - "C:/.../personal", "C:/.../personal" → ""
 */
export const toRelativePath = (fsPath: string, rootPath: string): string =>
  fsPath === rootPath ? '' : fsPath.slice(rootPath.length + 1)

// ── Root identity (path-based, per #84) ────────────────────────────────────────

/**
 * Returns the OS-absolute path to a Root given its folder name relative to
 * ROOT (e.g. "personal" → "C:/Users/.../Documents/nemos-app/personal").
 * This is the value used as route/session/tab identity for a Root.
 */
export const toAbsoluteRootPath = async (folderName: string): Promise<string> =>
  join(await documentDir(), ROOT, folderName)

/**
 * Returns `Documents/nemos-app` — the initial directory the "Add Workspace"
 * dialog's folder picker opens to (#87). Purely a picker convenience; the
 * folder the user picks becomes the Workspace's Root directly, wherever it
 * lives on disk.
 */
export const defaultWorkspaceParentPath = async (): Promise<string> =>
  join(await documentDir(), ROOT)

/**
 * Returns the last path segment of a Root's absolute path — used only for
 * display (e.g. a header title), not for fs path construction (per #85, a
 * Root can live anywhere on disk, so its absolute path is used directly for
 * fs operations rather than being reconstructed from a folder name).
 *
 * A plain last-segment split (not Tauri's IPC-backed `basename`) so this can
 * be called synchronously from route loaders, error components, and other
 * places that can't await.
 */
export const rootFolderName = (absolutePath: string): string => {
  const segments = absolutePath.split(/[/\\]/).filter(Boolean)
  return segments[segments.length - 1] ?? ''
}

// ── Path component helpers ────────────────────────────────────────────────────

/**
 * The entry name is the last segment of a path.
 *
 * Example:
 * - "folder/note.note" → "note.note"
 * - "folder" → "folder"
 * - "folderName/folder" → "folder"
 */
export const getEntryName = (path: string): string =>
  path.split('/').pop() ?? ''

/**
 * Returns the direct parent directory of a path.
 *
 * Example:
 * - "folder/note.note" → "folder"
 * - "folder" → ""
 * - "folderName/folder" → "folderName"
 */
export const getParentPath = (path: string): string =>
  path.split('/').slice(0, -1).join('/')

/**
 * Returns the entry name without the extension.
 *
 * Example:
 * - "folder/noteName.note" → "noteName"
 * - "folder" → "folder" (no extension, it's a folder)
 * - "folderName/folder" → "folder" (no extension, it's a folder)
 */
export const getBaseName = (path: string): string => {
  const name = getEntryName(path)
  return name.endsWith(`.${EXTENSION}`)
    ? name.slice(0, -(EXTENSION.length + 1))
    : name
}

// ── Note / folder classification ──────────────────────────────────────────────

/**
 * Returns true if the path ends with the extension `.note`.
 *
 * Example:
 * - "folder/noteName.note" → true
 * - false otherwise
 */
export const isNotePath = (path: string): boolean =>
  path.endsWith(`.${EXTENSION}`)

/**
 * Adds the extension `.note` to a bare name.
 *
 * Example:
 * - "my-note" → "my-note.note"
 */
export const toNoteFileName = (name: string): string => `${name}.${EXTENSION}`

/**
 * Returns the nearest parent container path for a note or folder.
 * A container is a folder that contains notes or folders.
 * So for a note, it returns the parent folder path.
 * For a folder, it returns itself.
 *
 * Example:
 * - "folder/noteName.note" → "folder"
 * - "folder" → "folder"
 */
export const getContainerPath = (path: string): string =>
  isNotePath(path) ? getParentPath(path) : path

// ── New entry path builders ───────────────────────────────────────────────────

/**
 * Returns a new note relative path inside the given parent entry (or the Root itself if empty).
 *
 * Example:
 * - "folder" → "folder/noteName.note"
 * - "" → "noteName.note"
 */
export const newNoteRelativePath = (parentRelativePath = ''): string => {
  const folder = getContainerPath(parentRelativePath)
  return folder
    ? `${folder}/${toNoteFileName(DEFAULT_NOTE_NAME)}`
    : toNoteFileName(DEFAULT_NOTE_NAME)
}

/**
 * Returns a new folder relative path inside the given parent entry (or the Root itself if empty).
 *
 * Example:
 * - "folder" → "folder/new-folder"
 * - "" → "new-folder"
 */
export const newFolderRelativePath = (parentRelativePath = ''): string => {
  const folder = getContainerPath(parentRelativePath)
  return folder ? `${folder}/${DEFAULT_FOLDER_NAME}` : DEFAULT_FOLDER_NAME
}
