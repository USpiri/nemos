import { FILE_EXTENSION } from '@/config/constants'
import { exists, rename } from '@/lib/fs'
import { NoteError } from '../errors'
import {
  getFolderParentPath,
  getNoteFolderPath,
  getNoteNameFromPath,
  getNotePath,
} from './path'

interface RenameNoteProps {
  workspace: string
  note: string // current note path
  newName: string // new note name, without file extension and workspace path
}

export const renameNote = async ({
  workspace,
  note,
  newName,
}: RenameNoteProps) => {
  const fromPath = getNotePath(`${workspace}/${note}`)
  const parentDir = getNoteFolderPath(fromPath)
  const newPath = `${parentDir}/${newName}${FILE_EXTENSION}`

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
  workspace: string
  folder: string // current folder path
  newName: string // new folder name, without file extension and workspace path
}

export const renameFolder = async ({
  workspace,
  folder,
  newName,
}: RenameFolderProps) => {
  const folderPath = getNotePath(`${workspace}/${folder}`)
  const parentDir = getFolderParentPath(folderPath)
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
  workspace: string
  note: string // workspace-relative path with extension, e.g. "folder/note.note"
  destination: string // workspace-relative target folder, e.g. "other-folder" or "" for root
}

export const moveNote = async ({
  workspace,
  note,
  destination,
}: MoveNoteProps) => {
  const fromPath = getNotePath(`${workspace}/${note}`)
  const fileName = getNoteNameFromPath(fromPath)
  const destDir = destination
    ? getNotePath(`${workspace}/${destination}`)
    : getNotePath(workspace)
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
  workspace: string
  folder: string // workspace-relative folder path, e.g. "parent/folder"
  destination: string // workspace-relative target folder, e.g. "other-folder" or "" for root
}

export const moveFolder = async ({
  workspace,
  folder,
  destination,
}: MoveFolderProps) => {
  const folderPath = getNotePath(`${workspace}/${folder}`)
  const folderName = getNoteNameFromPath(folderPath)
  const destDir = destination
    ? getNotePath(`${workspace}/${destination}`)
    : getNotePath(workspace)
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
