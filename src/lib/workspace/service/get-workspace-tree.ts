import { readDirRecursive } from '@/lib/fs'
import { WorkspaceError } from '../errors'
import { isValidWorkspaceTreeEntry, mapWorkspaceTree } from '../utils'
import { getWorkspacePath } from './path'

export const getWorkspaceTree = async (workspace: string) => {
  try {
    const tree = await readDirRecursive(getWorkspacePath(workspace))
    const filteredTree = tree.filter(isValidWorkspaceTreeEntry)
    return mapWorkspaceTree(filteredTree)
  } catch {
    throw new WorkspaceError(
      'GET_WORKSPACE_TREE_FAILED',
      'Failed to get workspace tree',
    )
  }
}
