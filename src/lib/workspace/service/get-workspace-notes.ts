import { readDirRecursive, stat } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'
import { isNoteFile } from '../utils'
import { DetailedWorkspaceEntry } from '../workspace.type'
import { sortRecentEntries } from './sort-entries'

/**
 * Gets the entries of a workspace.
 * Returns an array of workspace entry objects with the following properties:
 * - name: string (the name of the workspace entry)
 * - path: string (the full path to the workspace entry)
 * - isDirectory: boolean (true if the workspace entry is a directory)
 * - isFile: boolean (true if the workspace entry is a file)
 * - isSymlink: boolean (true if the workspace entry is a symlink)
 */
export const getWorkspaceEntries = async (
  workspace: string,
): Promise<DetailedWorkspaceEntry[]> => {
  const entries = await readDirRecursive(toFsPath(workspace))

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
 * Gets the summary of a workspace.
 * Returns an object with the following properties:
 * - count: number (the total number of notes in the workspace)
 * - notes: array of note objects with the following properties:
 *   - name: string (the name of the note)
 *   - path: string (the full path to the note)
 *   - modified: Date (the last modified date of the note)
 */
export const getWorkspaceSummary = async (workspace: string, limit = 10) => {
  const entries = await getWorkspaceEntries(workspace)
  const notes = sortRecentEntries(entries).slice(0, limit)
  return {
    count: entries.length,
    notes,
  }
}
