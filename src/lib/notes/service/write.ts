import matter from 'gray-matter'
import { write } from '@/lib/fs'
import type { Note } from '@/lib/notes'
import { NoteError } from '../errors'

export const writeNote = async (path: string, note: Note) => {
  try {
    // matter.stringify prepends ---\nfrontmatter\n---\n only if frontmatter has keys
    const raw = matter.stringify(note.content, note.frontmatter)
    await write(path, raw)
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'INVALID_CONTENT',
      `Failed to write note: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
