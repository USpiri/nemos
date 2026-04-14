import { copy, getUniquePath } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

interface Props {
  workspaceId: string
  relativePath: string
}

/**
 * Copies a note to a unique path.
 * Returns the unique path of the copied note.
 * throws an error if for some reason the note cannot be copied or
 * the note relative path is empty.
 */
export const copyNote = async ({ workspaceId, relativePath }: Props) => {
  if (!relativePath) {
    throw new NoteError('COPY_FAILED', 'Note path is required')
  }

  const notePath = toFsPath(workspaceId, relativePath)

  try {
    const uniquePath = await getUniquePath(notePath)
    await copy(notePath, uniquePath)
    return uniquePath
  } catch {
    throw new NoteError('COPY_FAILED', `Failed to copy note: ${notePath}`)
  }
}
