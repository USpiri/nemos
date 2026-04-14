import { removeDir, removeFile } from '@/lib/fs/remove'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

interface DeleteNoteProps {
  workspaceId: string
  relativePath: string
}

export const deleteNote = async ({
  workspaceId,
  relativePath,
}: DeleteNoteProps) => {
  const notePath = toFsPath(workspaceId, relativePath)
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
  workspaceId: string
  relativePath: string
}

export const deleteFolder = async ({
  workspaceId,
  relativePath,
}: DeleteFolderProps) => {
  const folderPath = toFsPath(workspaceId, relativePath)
  try {
    await removeDir(folderPath)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
