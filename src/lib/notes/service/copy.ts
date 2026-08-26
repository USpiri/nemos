import { copy, getUniquePath } from '@/lib/fs'
import { NoteError } from '../errors'

interface Props {
  path: string
}

/**
 * Copies a note to a unique path.
 * Returns the unique path of the copied note.
 * Throws an error if for some reason the note cannot be copied.
 */
export const copyNote = async ({ path }: Props) => {
  try {
    const uniquePath = await getUniquePath(path)
    await copy(path, uniquePath)
    return uniquePath
  } catch {
    throw new NoteError('COPY_FAILED', `Failed to copy note: ${path}`)
  }
}
