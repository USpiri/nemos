import { WorkspaceError } from '../errors'
import { useWorkspaceRegistry } from '../workspace-registry'

/**
 * Gets all pinned Workspaces from the registry (#86).
 * Returns an array of `{ name, path }` entries — `path` is the Root's
 * OS-absolute path (its route/session identity per #84).
 */
export const getWorkspaces = async () => {
  try {
    await useWorkspaceRegistry.getState().init()
    return useWorkspaceRegistry.getState().workspaces
  } catch {
    throw new WorkspaceError(
      'GET_WORKSPACES_FAILED',
      'Failed to get workspaces',
    )
  }
}
