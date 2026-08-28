import { createDir, exists, fsNameSchema } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { WorkspaceError } from '../errors'

/**
 * Creates a brand-new empty folder at `parentPath/name` (#87). `parentPath`
 * is an absolute location — the "Create new Workspace" dialog's full-path
 * default (`Documents/nemos-app`) or a folder picked to override it — so
 * this only joins onto it rather than reconstructing a path from `ROOT`
 * (per #85, a Root can live anywhere on disk).
 */
export const createWorkspace = async (parentPath: string, name: string) => {
  const parsed = fsNameSchema.safeParse(name)
  if (!parsed.success)
    throw new WorkspaceError('INVALID_NAME', parsed.error.message)

  const path = toFsPath(parentPath, parsed.data)
  if (await exists(path)) throw new WorkspaceError('ALREADY_EXISTS')

  await createDir(path)
  return path
}
