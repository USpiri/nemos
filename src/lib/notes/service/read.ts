import matter from 'gray-matter'
import { read } from '@/lib/fs'
import { emptyNote, FrontmatterSchema, NoteError } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'

export const readNote = async (workspaceId: string, relativePath: string) => {
  let raw: string
  try {
    raw = await read(toFsPath(workspaceId, relativePath))
  } catch {
    throw new NoteError('NOT_FOUND', `Note not found: ${relativePath}`)
  }

  if (raw.trim().length === 0) return emptyNote

  try {
    const { data, content } = matter(raw)
    const frontmatter = FrontmatterSchema.parse(data)
    return { frontmatter, content }
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError(
      'INVALID_CONTENT',
      `Invalid note content: ${relativePath}`,
    )
  }
}
