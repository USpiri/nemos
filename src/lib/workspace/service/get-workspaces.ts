import { ROOT } from '@/config/constants'
import { readDir } from '@/lib/fs'
import { WorkspaceError } from '../errors'
import { isValidWorkspaceDirectory } from '../utils'
import { getWorkspacePath } from './path'

export const getWorkspaces = async () => {
  try {
    const entries = await readDir(ROOT)
    const entriesWithPath = entries.map((entry) => ({
      ...entry,
      path: getWorkspacePath(entry.name),
    }))

    const workspaces = entriesWithPath.filter(isValidWorkspaceDirectory)

    return workspaces
  } catch {
    throw new WorkspaceError(
      'GET_WORKSPACES_FAILED',
      'Failed to get workspaces',
    )
  }
}
