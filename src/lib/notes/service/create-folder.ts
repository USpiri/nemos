import { createDir, getUniquePath } from '@/lib/fs'
import { NoteError } from '../errors'
import { getNotePath } from './path'

interface Props {
  workspace: string
  path: string
}

export const createFolder = async ({ workspace, path }: Props) => {
  const folderPath = getNotePath(`${workspace}/${path}`)

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
