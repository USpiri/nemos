import type { NoteTab } from './tab.type'

export const createNoteTab = ({
  id,
  title,
  path,
  workspaceId,
  noteId,
}: {
  id: string
  title: string
  path: string
  workspaceId: string
  noteId: string
}): NoteTab => {
  return {
    id,
    type: 'note',
    title,
    path,
    dirty: false,
    payload: { workspaceId, noteId },
  }
}
