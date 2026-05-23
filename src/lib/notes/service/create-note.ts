import { getUniquePath, write } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

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
    await write(uniquePath, content ?? '')
    return uniquePath
  } catch (error) {
    throw new NoteError(
      'CREATE_FAILED',
      `Failed to create note: ${notePath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
