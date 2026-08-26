import { removeDir, removeFile } from '@/lib/fs/remove'
import { NoteError } from '../errors'

interface DeleteNoteProps {
  path: string
}

export const deleteNote = async ({ path }: DeleteNoteProps) => {
  try {
    await removeFile(path)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface DeleteFolderProps {
  path: string
}

export const deleteFolder = async ({ path }: DeleteFolderProps) => {
  try {
    await removeDir(path)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
