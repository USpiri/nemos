import { removeDir, removeFile } from '@/lib/fs/remove'
import { NoteError } from '../errors'
import { getNotePath } from './path'

interface DeleteNoteProps {
  workspace: string
  note: string
}

export const deleteNote = async ({ workspace, note }: DeleteNoteProps) => {
  const notePath = getNotePath(`${workspace}/${note}`)
  try {
    await removeFile(notePath)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface DeleteFolderProps {
  workspace: string
  folder: string
}

export const deleteFolder = async ({
  workspace,
  folder,
}: DeleteFolderProps) => {
  const folderPath = getNotePath(`${workspace}/${folder}`)
  try {
    await removeDir(folderPath)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
