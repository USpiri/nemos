import { createDir, getUniquePath } from '@/lib/fs'
import { NoteError } from '../errors'

interface Props {
  path: string
}

export const createFolder = async ({ path }: Props) => {
  try {
    const uniquePath = await getUniquePath(path)
    await createDir(uniquePath)
    return uniquePath
  } catch {
    throw new NoteError('CREATE_FAILED', `Failed to create folder: ${path}`)
  }
}
