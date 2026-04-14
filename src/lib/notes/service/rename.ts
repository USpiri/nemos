import { exists, rename } from '@/lib/fs'
import {
  getContainerPath,
  getEntryName,
  getParentPath,
  toFsPath,
  toNoteFileName,
} from '@/lib/paths'
import { NoteError } from '../errors'

// TODO: Abstract rename operations to a common function

interface RenameNoteProps {
  workspaceId: string
  relativePath: string
  newName: string
}

export const renameNote = async ({
  workspaceId,
  relativePath,
  newName,
}: RenameNoteProps) => {
  const fromPath = toFsPath(workspaceId, relativePath)
  const parentDir = getContainerPath(fromPath)
  const newPath = `${parentDir}/${toNoteFileName(newName)}`

  try {
    const existsTo = await exists(newPath)
    if (existsTo)
      throw new NoteError('RENAME_FAILED', `Note already exists: ${newPath}`)

    const existsFrom = await exists(fromPath)
    if (!existsFrom)
      throw new NoteError('NOT_FOUND', `Note not found: ${fromPath}`)

    await rename(fromPath, newPath)
    return newPath
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'RENAME_FAILED',
      `Failed to rename note: ${fromPath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface RenameFolderProps {
  workspaceId: string
  relativePath: string
  newName: string
}

export const renameFolder = async ({
  workspaceId,
  relativePath,
  newName,
}: RenameFolderProps) => {
  const folderPath = toFsPath(workspaceId, relativePath)
  const parentDir = getParentPath(folderPath)
  const newPath = `${parentDir}/${newName}`

  try {
    const existsTo = await exists(newPath)
    if (existsTo)
      throw new NoteError('RENAME_FAILED', `Folder already exists: ${newPath}`)

    const existsFrom = await exists(folderPath)
    if (!existsFrom)
      throw new NoteError('NOT_FOUND', `Folder not found: ${folderPath}`)

    await rename(folderPath, newPath)
    return newPath
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'RENAME_FAILED',
      `Failed to rename folder: ${folderPath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface MoveNoteProps {
  workspaceId: string
  relativePath: string
  destinationPath: string
}

export const moveNote = async ({
  workspaceId,
  relativePath,
  destinationPath,
}: MoveNoteProps) => {
  const fromPath = toFsPath(workspaceId, relativePath)
  const fileName = getEntryName(fromPath)
  const destDir = destinationPath
    ? toFsPath(workspaceId, destinationPath)
    : toFsPath(workspaceId)
  const newPath = `${destDir}/${fileName}`

  if (fromPath === newPath) return fromPath

  try {
    const existsTo = await exists(newPath)
    if (existsTo)
      throw new NoteError('RENAME_FAILED', `Note already exists: ${newPath}`)

    const existsFrom = await exists(fromPath)
    if (!existsFrom)
      throw new NoteError('NOT_FOUND', `Note not found: ${fromPath}`)

    await rename(fromPath, newPath)
    return newPath
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'RENAME_FAILED',
      `Failed to move note: ${fromPath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface MoveFolderProps {
  workspaceId: string
  relativePath: string
  destinationPath: string
}

export const moveFolder = async ({
  workspaceId,
  relativePath,
  destinationPath,
}: MoveFolderProps) => {
  const folderPath = toFsPath(workspaceId, relativePath)
  const folderName = getEntryName(folderPath)
  const destDir = destinationPath
    ? toFsPath(workspaceId, destinationPath)
    : toFsPath(workspaceId)
  const newPath = `${destDir}/${folderName}`

  if (folderPath === newPath) return folderPath

  try {
    const existsTo = await exists(newPath)
    if (existsTo)
      throw new NoteError('RENAME_FAILED', `Folder already exists: ${newPath}`)

    const existsFrom = await exists(folderPath)
    if (!existsFrom)
      throw new NoteError('NOT_FOUND', `Folder not found: ${folderPath}`)

    await rename(folderPath, newPath)
    return newPath
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'RENAME_FAILED',
      `Failed to move folder: ${folderPath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
