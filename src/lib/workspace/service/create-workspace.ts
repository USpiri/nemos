import { createDir, exists, fsNameSchema } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { WorkspaceError } from '../errors'

export const createWorkspace = async (workspace: string) => {
  const parsed = fsNameSchema.safeParse(workspace)
  if (!parsed.success)
    throw new WorkspaceError('INVALID_NAME', parsed.error.message)

  const path = toFsPath(parsed.data)
  if (await exists(path)) throw new WorkspaceError('ALREADY_EXISTS')

  return createDir(toFsPath(workspace))
}
