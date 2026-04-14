import { LinkOptions, linkOptions } from '@tanstack/react-router'
import { getBaseName } from '@/lib/paths'
import type { NoteTab, Tab } from './tab.type'

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
    title: getBaseName(noteId) || 'Untitled',
    path: `workspace/${workspaceId}/notes/${noteId}`,
    dirty: false,
    payload: { workspaceId, noteId },
  }
}

export const buildNavigationFromTab = (tab: Tab): LinkOptions => {
  switch (tab.type) {
    case 'note':
      return linkOptions({
        to: '/workspace/$workspaceId/notes/$noteId',
        params: {
          workspaceId: tab.payload.workspaceId as string,
          noteId: tab.payload.noteId as string,
        },
      })
    default:
      return linkOptions({
        to: '/',
      })
  }
}
