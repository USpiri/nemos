import { exists, rename } from '@/lib/fs'
import { join } from '@/lib/fs/path'
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
  const newPath = await join(parentDir, toNoteFileName(newName))

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'note',
    operation: 'rename',
  })
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
  const newPath = await join(parentDir, newName)

  return moveOrRename({
    fromPath: folderPath,
    toPath: newPath,
    entity: 'folder',
    operation: 'rename',
  })
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
  const newPath = await join(destDir, fileName)

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'note',
    operation: 'move',
  })
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
  const newPath = await join(destDir, folderName)

  return moveOrRename({
    fromPath: folderPath,
    toPath: newPath,
    entity: 'folder',
    operation: 'move',
  })
}
