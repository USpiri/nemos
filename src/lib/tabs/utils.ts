import { getNoteNameWithoutExtension } from '../notes'
import type { NoteTab } from './tab.type'

export const createNoteTab = ({
  workspaceId,
  noteId,
}: {
  workspaceId: string
  noteId: string
}): NoteTab => {
  return {
    id: noteId,
    type: 'note',
    title:
      getNoteNameWithoutExtension(`${workspaceId}/${noteId}`) || 'Untitled',
    path: `workspace/${workspaceId}/notes/${noteId}`,
    dirty: false,
    payload: { workspaceId, noteId },
  }
}
