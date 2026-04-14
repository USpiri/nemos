import {
  DEFAULT_FOLDER_NAME,
  DEFAULT_NOTE_NAME,
  EXTENSION,
  ROOT,
} from '@/config/constants'

// ── Filesystem paths (used only at the fs layer) ──────────────────────────────

/**
 * Returns nemos-app/workspaceId or nemos-app/workspaceId/relativePath
 *
 * Example:
 * - "workspaceId" → "nemos-app/workspaceId"
 * - "workspaceId/folder/note.note" → "nemos-app/workspaceId/folder/note.note"\
 */
export const toFsPath = (workspaceId: string, relativePath = ''): string =>
  relativePath
    ? `${ROOT}/${workspaceId}/${relativePath}`
    : `${ROOT}/${workspaceId}`

// ── Relative path extraction ──────────────────────────────────────────────────

/**
 * Strips ROOT/workspaceId/ prefix from a fsPath produced by toFsPath → relativePath
 *
 * Example:
 * - "nemos-app/workspaceId/folder/note.note" → "folder/note.note"
 * - "nemos-app/workspaceId/folder" → "folder"
 * - "nemos-app/workspaceId" → ""
 */
export const toRelativePath = (fsPath: string): string =>
  fsPath
    .split('/')
    .slice(ROOT.split('/').length + 1)
    .join('/')

// ── Path component helpers ────────────────────────────────────────────────────

/**
 * The entry name is the last segment of a path.
 *
 * Example:
 * - "folder/note.note" → "note.note"
 * - "folder" → "folder"
 * - "workspaceId/folder" → "folder"
 */
export const getEntryName = (path: string): string =>
  path.split('/').pop() ?? ''

/**
 * Returns the direct parent directory of a path.
 *
 * Example:
 * - "folder/note.note" → "folder"
 * - "folder" → ""
 * - "workspaceId/folder" → "workspaceId"
 */
export const getParentPath = (path: string): string =>
  path.split('/').slice(0, -1).join('/')

/**
 * Returns the entry name without the extension.
 *
 * Example:
 * - "folder/noteName.note" → "noteName"
 * - "folder" → "folder" (no extension, it's a folder)
 * - "workspaceId/folder" → "folder" (no extension, it's a folder)
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
 * Returns a new note relative path inside the given parent entry (or workspace root if empty).
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
 * Returns a new folder relative path inside the given parent entry (or workspace root if empty).
 *
 * Example:
 * - "folder" → "folder/new-folder"
 * - "" → "new-folder"
 */
export const newFolderRelativePath = (parentRelativePath = ''): string => {
  const folder = getContainerPath(parentRelativePath)
  return folder ? `${folder}/${DEFAULT_FOLDER_NAME}` : DEFAULT_FOLDER_NAME
}
