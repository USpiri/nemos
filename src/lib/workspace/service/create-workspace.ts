import { createDir, exists, fsNameSchema } from '@/lib/fs'
import { WorkspaceError } from '../errors'
import { getWorkspacePath } from './path'

export const createWorkspace = async (workspace: string) => {
  const parsed = fsNameSchema.safeParse(workspace)
  if (!parsed.success)
    throw new WorkspaceError('INVALID_NAME', parsed.error.message)

  const path = getWorkspacePath(parsed.data)
  if (await exists(path)) throw new WorkspaceError('ALREADY_EXISTS')

  return createDir(getWorkspacePath(workspace))
}
