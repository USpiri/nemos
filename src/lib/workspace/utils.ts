import {
  getContainerPath,
  getParentPath,
  isNotePath,
  toRelativePath,
} from '@/lib/paths'
import { RootEntry } from './workspace.type'

export const mapRootTree = (tree: RootEntry[]) => {
  return tree.map((item) => ({
    id: item.path,
    parent: getParentPath(item.path),
    text: item.name,
    droppable: item.isDirectory,
  }))
}

/**
 * Checks if a Root tree entry is valid.
 * Returns true if the Root tree entry is a file and is a note,
 * and does not have a hidden parent.
 *
 * Example:
 * - a file that is not a note (returns false)
 * - a file or directory that has a hidden parent (returns false, is inside a hidden folder)
 */
export const isValidRootTreeEntry = (entry: RootEntry) => {
  if (entry.isFile && !isNotePath(entry.name)) return false
  if (hasHiddenParent(entry.path)) return false
  return true
}

export const hasHiddenParent = (path: string) => {
  return path.split('/').some((part) => part.startsWith('.'))
}

export const isNoteFile = (entry: RootEntry) => {
  return entry.isFile && isNotePath(entry.name)
}

export const getNoteRelativeDir = (path: string, rootPath: string) => {
  const relative = toRelativePath(path, rootPath)
  const containerRelative = getContainerPath(relative)
  return containerRelative ? `/${containerRelative}` : '/'
}
