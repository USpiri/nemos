import { createDir, getUniquePath } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

interface Props {
  workspaceId: string
  relativePath: string
}

export const createFolder = async ({ workspaceId, relativePath }: Props) => {
  const folderPath = toFsPath(workspaceId, relativePath)

  try {
    const uniquePath = await getUniquePath(folderPath)
    await createDir(uniquePath)
    return uniquePath
  } catch {
    throw new NoteError(
      'CREATE_FAILED',
      `Failed to create folder: ${folderPath}`,
    )
  }
}
