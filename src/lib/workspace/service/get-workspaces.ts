import { ROOT } from '@/config/constants'
import { readDir } from '@/lib/fs'
import { toAbsoluteRootPath } from '@/lib/paths'
import { WorkspaceError } from '../errors'
import { isValidWorkspaceDirectory } from '../utils'

/**
 * Gets all workspaces in the root directory.
 * Returns an array of workspace objects with the following properties:
 * - name: string (the workspace name, same as the directory name relative to the root directory)
 * - path: string (the Root's OS-absolute path — its route/session identity per #84)
 * - isDirectory: boolean
 * - isFile: boolean
 * - isSymlink: boolean
 */
export const getWorkspaces = async () => {
  try {
    const entries = await readDir(ROOT)
    const entriesWithPath = await Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        path: await toAbsoluteRootPath(entry.name),
      })),
    )

    const workspaces = entriesWithPath.filter(isValidWorkspaceDirectory)

    return workspaces
  } catch {
    throw new WorkspaceError(
      'GET_WORKSPACES_FAILED',
      'Failed to get workspaces',
    )
  }
}
