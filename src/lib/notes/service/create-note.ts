import { getUniquePath, write } from '@/lib/fs'
import { NoteError } from '../errors'

interface Props {
  path: string
  content?: string
}

export const createNote = async ({ path, content }: Props) => {
  try {
    const uniquePath = await getUniquePath(path)
    await write(uniquePath, content ?? '')
    return uniquePath
  } catch (error) {
    throw new NoteError(
      'CREATE_FAILED',
      `Failed to create note: ${path}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
