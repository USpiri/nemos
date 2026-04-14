import { ROOT } from '@/config/constants'
import { readDir } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { WorkspaceError } from '../errors'
import { isValidWorkspaceDirectory } from '../utils'

/**
 * Gets all workspaces in the root directory.
 * Returns an array of workspace objects with the following properties:
 * - name: string (the workspace name, same as the directory name relative to the root directory)
 * - path: string (the full path to the workspace directory)
 * - isDirectory: boolean
 * - isFile: boolean
 * - isSymlink: boolean
 */
export const getWorkspaces = async () => {
  try {
    const entries = await readDir(ROOT)
    const entriesWithPath = entries.map((entry) => ({
      ...entry,
      // return the full path to the workspace directory
      path: toFsPath(entry.name),
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
