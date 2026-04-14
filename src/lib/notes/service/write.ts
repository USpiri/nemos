import { writeJson } from '@/lib/fs'
import { Note, NoteError, NoteSchema } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'

export const writeNote = async (
  workspaceId: string,
  relativePath: string,
  note: Note,
) => {
  const parsed = NoteSchema.safeParse(note)

  if (!parsed.success) {
    throw new NoteError(
      'INVALID_CONTENT',
      parsed.error.issues.map((e) => e.message).join(', '),
    )
  }

  await writeJson(toFsPath(workspaceId, relativePath), parsed.data)
}
