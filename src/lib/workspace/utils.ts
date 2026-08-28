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

export const hasHiddenParent = (path: string) => {
  return path.split('/').some((part) => part.startsWith('.'))
}

export const isNoteFile = (entry: WorkspaceEntry) => {
  return entry.isFile && isNotePath(entry.name)
}

export const getNoteRelativeDir = (path: string, rootPath: string) => {
  const relative = toRelativePath(path, rootPath)
  const containerRelative = getContainerPath(relative)
  return containerRelative ? `/${containerRelative}` : '/'
}
