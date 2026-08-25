import { removeDir, removeFile } from '@/lib/fs/remove'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

interface DeleteNoteProps {
  rootPath: string
  relativePath: string
}

export const deleteNote = async ({
  rootPath,
  relativePath,
}: DeleteNoteProps) => {
  const notePath = toFsPath(rootPath, relativePath)
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
  rootPath: string
  relativePath: string
}

export const deleteFolder = async ({
  rootPath,
  relativePath,
}: DeleteFolderProps) => {
  const folderPath = toFsPath(rootPath, relativePath)
  try {
    await removeDir(folderPath)
  } catch (error) {
    throw new NoteError(
      'DELETE_FAILED',
      `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
