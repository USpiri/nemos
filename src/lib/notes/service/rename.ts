import { exists, rename } from '@/lib/fs'
import {
  getContainerPath,
  getEntryName,
  getParentPath,
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
  path: string
  newName: string
}

export const renameNote = async ({ path, newName }: RenameNoteProps) => {
  const parentDir = getContainerPath(path)
  const newPath = `${parentDir}/${toNoteFileName(newName)}`

  return moveOrRename({
    fromPath: path,
    toPath: newPath,
    entity: 'note',
    operation: 'rename',
  })
}

interface RenameFolderProps {
  path: string
  newName: string
}

export const renameFolder = async ({ path, newName }: RenameFolderProps) => {
  const parentDir = getParentPath(path)
  const newPath = `${parentDir}/${newName}`

  return moveOrRename({
    fromPath: path,
    toPath: newPath,
    entity: 'folder',
    operation: 'rename',
  })
}

interface MoveNoteProps {
  fromPath: string
  toDir: string
}

export const moveNote = async ({ fromPath, toDir }: MoveNoteProps) => {
  const fileName = getEntryName(fromPath)
  const newPath = `${toDir}/${fileName}`

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'note',
    operation: 'move',
  })
}

interface MoveFolderProps {
  fromPath: string
  toDir: string
}

export const moveFolder = async ({ fromPath, toDir }: MoveFolderProps) => {
  const folderName = getEntryName(fromPath)
  const newPath = `${toDir}/${folderName}`

  return moveOrRename({
    fromPath,
    toPath: newPath,
    entity: 'folder',
    operation: 'move',
  })
}
