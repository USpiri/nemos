import { getUniquePath, write } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'
import { Note } from '../note.type'

interface Props {
  workspaceId: string
  relativePath: string
  content?: string
}

export const createNote = async ({
  workspaceId,
  relativePath,
  content,
}: Props) => {
  const notePath = toFsPath(workspaceId, relativePath)

  try {
    const uniquePath = await getUniquePath(notePath)
    const note: Note = {
      content: content || '',
    }

    await write(uniquePath, JSON.stringify(note, null, 2))
    return uniquePath
  } catch (error) {
    throw new NoteError(
      'CREATE_FAILED',
      `Failed to create note: ${notePath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
