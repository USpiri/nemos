import { readDirRecursive } from '@/lib/fs'
import { WorkspaceError } from '../errors'
import { isValidRootTreeEntry, mapRootTree } from '../utils'

/**
 * Gets the tree of a Root.
 * Returns an array of Root tree objects with the following properties:
 * - id: string (the full path to the Root tree entry)
 * - parent: string (the parent path of the Root tree entry)
 * - text: string (the name of the Root tree entry)
 * - droppable: boolean (true if the Root tree entry is a directory)
 */
export const getRootTree = async (rootPath: string) => {
  try {
    const tree = await readDirRecursive(rootPath)
    const filteredTree = tree.filter(isValidRootTreeEntry)
    return mapRootTree(filteredTree)
  } catch {
    throw new WorkspaceError('GET_ROOT_TREE_FAILED', 'Failed to get Root tree')
  }
}
