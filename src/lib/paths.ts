import { documentDir, join } from '@tauri-apps/api/path'
import {
  DEFAULT_FOLDER_NAME,
  DEFAULT_NOTE_NAME,
  EXTENSION,
  ROOT,
} from '@/config/constants'

// ── Filesystem paths (used only at the fs layer) ──────────────────────────────

/**
 * Returns nemos-app/folderName or nemos-app/folderName/relativePath
 *
 * Example:
 * - "folderName" → "nemos-app/folderName"
 * - "folderName/folder/note.note" → "nemos-app/folderName/folder/note.note"\
 */
export const toFsPath = (folderName: string, relativePath = ''): string =>
  relativePath
    ? `${ROOT}/${folderName}/${relativePath}`
    : `${ROOT}/${folderName}`

// ── Relative path extraction ──────────────────────────────────────────────────

/**
 * Strips ROOT/folderName/ prefix from a fsPath produced by toFsPath → relativePath
 *
 * Example:
 * - "nemos-app/folderName/folder/note.note" → "folder/note.note"
 * - "nemos-app/folderName/folder" → "folder"
 * - "nemos-app/folderName" → ""
 */
export const toRelativePath = (fsPath: string): string =>
  fsPath
    .split('/')
    .slice(ROOT.split('/').length + 1)
    .join('/')

// ── Root identity (path-based, per #84) ────────────────────────────────────────

/**
 * Returns the OS-absolute path to a Root given its folder name relative to
 * ROOT (e.g. "personal" → "C:/Users/.../Documents/nemos-app/personal").
 * This is the value used as route/session/tab identity for a Root.
 */
export const toAbsoluteRootPath = async (folderName: string): Promise<string> =>
  join(await documentDir(), ROOT, folderName)

/**
 * Recovers the ROOT-relative folder name from a Root's absolute path, so
 * existing folder-name-keyed fs functions (toFsPath, getWorkspaceTree, etc.)
 * keep working unchanged. Scoped to Roots that are flat children of ROOT —
 * true for every Root that exists today; arbitrary Roots are out of scope
 * for this prefactor.
 *
 * A plain last-segment split (not Tauri's IPC-backed `basename`) so this can
 * be called synchronously from route loaders, error components, and other
 * places that can't await — every Root path is produced by
 * toAbsoluteRootPath, so the shape is always known.
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
