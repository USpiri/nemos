import { readDirRecursive } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { WorkspaceError } from '../errors'
import { isValidWorkspaceTreeEntry, mapWorkspaceTree } from '../utils'

/**
 * Gets the tree of a workspace.
 * Returns an array of workspace tree objects with the following properties:
 * - id: string (the full path to the workspace tree entry)
 * - parent: string (the parent path of the workspace tree entry)
 * - text: string (the name of the workspace tree entry)
 * - droppable: boolean (true if the workspace tree entry is a directory)
 */
export const getWorkspaceTree = async (workspace: string) => {
  try {
    const tree = await readDirRecursive(toFsPath(workspace))
    const filteredTree = tree.filter(isValidWorkspaceTreeEntry)
    return mapWorkspaceTree(filteredTree)
  } catch {
    throw new WorkspaceError(
      'GET_WORKSPACE_TREE_FAILED',
      'Failed to get workspace tree',
    )
  }
}
