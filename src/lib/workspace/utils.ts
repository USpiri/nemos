import {
  getContainerPath,
  getParentPath,
  isNotePath,
  toRelativePath,
} from '@/lib/paths'
import { WorkspaceEntry } from './workspace.type'

export const mapWorkspaceTree = (tree: WorkspaceEntry[]) => {
  return tree.map((item) => ({
    id: item.path,
    parent: getParentPath(item.path),
    text: item.name,
    droppable: item.isDirectory,
  }))
}

/**
 * Checks if a workspace tree entry is valid.
 * Returns true if the workspace tree entry is a file and is a note,
 * and does not have a hidden parent.
 *
 * Example:
 * - a file that is not a note (returns false)
 * - a file or directory that has a hidden parent (returns false, is inside a hidden folder)
 */
export const isValidWorkspaceTreeEntry = (entry: WorkspaceEntry) => {
  if (entry.isFile && !isNotePath(entry.name)) return false
  if (hasHiddenParent(entry.path)) return false
  return true
}

/**
 * Checks if a workspace directory is valid.
 * Returns true if the workspace directory is a directory and it's not hidden.
 *
 * Example:
 * - a directory that is hidden (returns false)
 * - a directory that is not hidden (returns true)
 * - a file (returns false)
 */
export const isValidWorkspaceDirectory = (entry: WorkspaceEntry) => {
  // Checked against `name`, not `path` — `path` is now the Root's OS-absolute
  // path (per #84) and can't be split on '/' the way a ROOT-relative fsPath
  // can. Workspaces are always flat children of ROOT, so the name alone is
  // enough to detect a dot-prefixed (hidden) directory.
  return entry.isDirectory && !entry.name.startsWith('.')
}

export const hasHiddenParent = (path: string) => {
  return path.split('/').some((part) => part.startsWith('.'))
}

export const isNoteFile = (entry: WorkspaceEntry) => {
  return entry.isFile && isNotePath(entry.name)
}

export const getNoteRelativeDir = (path: string) => {
  const relative = toRelativePath(path)
  const containerRelative = getContainerPath(relative)
  return containerRelative ? `/${containerRelative}` : '/'
}
