import { exists, rename } from '@/lib/fs'
import {
  getContainerPath,
  getEntryName,
  getParentPath,
  toFsPath,
  toNoteFileName,
} from '@/lib/paths'
import { NoteError } from '../errors'

interface MoveOrRenameProps {
  fromPath: string
  toPath: string
  entity: 'note' | 'folder'
  operation: 'rename' | 'move'
}

const moveOrRename = async ({
  fromPath,
  toPath,
  entity,
  operation,
}: MoveOrRenameProps) => {
  if (fromPath === toPath) return fromPath

  try {
    const existsTo = await exists(toPath)
    if (existsTo)
      throw new NoteError(
        'RENAME_FAILED',
        `${entity} already exists: ${toPath}`,
      )

    const existsFrom = await exists(fromPath)
    if (!existsFrom)
      throw new NoteError(
        'NOT_FOUND',
        `${operation} ${entity} not found: ${fromPath}`,
      )

    await rename(fromPath, toPath)
    return toPath
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'RENAME_FAILED',
      `Failed to ${operation} ${entity}: ${fromPath}\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

interface RenameNoteProps {
  rootPath: string
  relativePath: string
  newName: string
}

export const renameNote = async ({
  rootPath,
  relativePath,
  newName,
}: RenameNoteProps) => {
  const fromPath = toFsPath(rootPath, relativePath)
  const parentDir = getContainerPath(fromPath)
  const newPath = `${parentDir}/${toNoteFileName(newName)}`

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'note',
    operation: 'rename',
  })
}

interface RenameFolderProps {
  rootPath: string
  relativePath: string
  newName: string
}

export const renameFolder = async ({
  rootPath,
  relativePath,
  newName,
}: RenameFolderProps) => {
  const folderPath = toFsPath(rootPath, relativePath)
  const parentDir = getParentPath(folderPath)
  const newPath = `${parentDir}/${newName}`

  return moveOrRename({
    fromPath: folderPath,
    toPath: newPath,
    entity: 'folder',
    operation: 'rename',
  })
}

interface MoveNoteProps {
  rootPath: string
  relativePath: string
  destinationPath: string
}

export const moveNote = async ({
  rootPath,
  relativePath,
  destinationPath,
}: MoveNoteProps) => {
  const fromPath = toFsPath(rootPath, relativePath)
  const fileName = getEntryName(fromPath)
  const destDir = destinationPath
    ? toFsPath(rootPath, destinationPath)
    : toFsPath(rootPath)
  const newPath = `${destDir}/${fileName}`

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'note',
    operation: 'move',
  })
}

interface MoveFolderProps {
  rootPath: string
  relativePath: string
  destinationPath: string
}

export const moveFolder = async ({
  rootPath,
  relativePath,
  destinationPath,
}: MoveFolderProps) => {
  const folderPath = toFsPath(rootPath, relativePath)
  const folderName = getEntryName(folderPath)
  const destDir = destinationPath
    ? toFsPath(rootPath, destinationPath)
    : toFsPath(rootPath)
  const newPath = `${destDir}/${folderName}`

  return moveOrRename({
    fromPath: folderPath,
    toPath: newPath,
    entity: 'folder',
    operation: 'move',
  })
}
