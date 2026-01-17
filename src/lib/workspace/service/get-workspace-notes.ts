import { readDirRecursive, stat } from '@/lib/fs'
import { isNoteFile } from '../utils'
import { DetailedWorkspaceEntry } from '../workspace.type'
import { getWorkspacePath } from './path'
import { sortRecentEntries } from './sort-entries'

export const getWorkspaceEntries = async (
  workspace: string,
): Promise<DetailedWorkspaceEntry[]> => {
  const entries = await readDirRecursive(getWorkspacePath(workspace))
  const notes = entries.filter(isNoteFile)
  const stats = await Promise.all(notes.map((note) => stat(note.path)))
  return notes.map((note, index) => ({
    ...note,
    modified: stats[index].mtime,
  }))
}

export const getWorkspaceSummary = async (workspace: string, limit = 10) => {
  const entries = await getWorkspaceEntries(workspace)
  const notes = sortRecentEntries(entries).slice(0, limit)
  return {
    count: entries.length,
    notes,
  }
}
