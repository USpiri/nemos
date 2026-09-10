import { readDirRecursive, stat } from '@/lib/fs'
import { isNoteFile } from '../utils'
import { DetailedRootEntry } from '../workspace.type'
import { sortRecentEntries } from './sort-entries'

/**
 * Gets the entries of a Root.
 * Returns an array of Root entry objects with the following properties:
 * - name: string (the name of the Root entry)
 * - path: string (the full path to the Root entry)
 * - isDirectory: boolean (true if the Root entry is a directory)
 * - isFile: boolean (true if the Root entry is a file)
 * - isSymlink: boolean (true if the Root entry is a symlink)
 */
export const getRootEntries = async (
  rootPath: string,
): Promise<DetailedRootEntry[]> => {
  const entries = await readDirRecursive(rootPath)

  // filter out non-note files
  const notes = entries.filter(isNoteFile)

  // get the metadata of each note
  const stats = await Promise.all(notes.map((note) => stat(note.path)))
  return notes.map((note, index) => ({
    ...note,
    modified: stats[index].mtime,
  }))
}

/**
 * Gets the summary of a Root.
 * Returns an object with the following properties:
 * - count: number (the total number of notes in the Root)
 * - notes: array of note objects with the following properties:
 *   - name: string (the name of the note)
 *   - path: string (the full path to the note)
 *   - modified: Date (the last modified date of the note)
 */
export const getRootSummary = async (rootPath: string, limit = 10) => {
  const entries = await getRootEntries(rootPath)
  const notes = sortRecentEntries(entries).slice(0, limit)
  return {
    count: entries.length,
    notes,
  }
}
