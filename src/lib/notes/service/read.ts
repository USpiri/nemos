import { read } from '@/lib/fs'
import { emptyNote, NoteSchema } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'
import { NoteError } from '../errors'

const readRawNote = async (workspaceId: string, relativePath: string) => {
  try {
    return await read(toFsPath(workspaceId, relativePath))
  } catch {
    throw new NoteError('NOT_FOUND', `Note not found: ${relativePath}`)
  }
}

const parseNote = (raw: string) => {
  if (raw.trim().length === 0) return emptyNote

  try {
    const parsed = NoteSchema.safeParse(JSON.parse(raw))

    if (!parsed.success)
      throw new NoteError(
        'INVALID_CONTENT',
        parsed.error.issues.map((e) => e.message).join(', '),
      )

    return parsed.data
  } catch (error) {
    if (error instanceof NoteError) throw error
    throw new NoteError('INVALID_CONTENT', `Invalid note content: ${raw}`)
  }
}

export const readNote = async (workspaceId: string, relativePath: string) => {
  const raw = await readRawNote(workspaceId, relativePath)
  return parseNote(raw)
}
