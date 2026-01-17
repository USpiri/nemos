import { readDirRecursive } from '@/lib/fs'
import { isValidWorkspaceTreeEntry, mapWorkspaceTree } from '../utils'
import { getWorkspacePath } from './path'

export const getWorkspaceTree = async (workspace: string) => {
  const tree = await readDirRecursive(getWorkspacePath(workspace))
  const filteredTree = tree.filter(isValidWorkspaceTreeEntry)
  return mapWorkspaceTree(filteredTree)
}
