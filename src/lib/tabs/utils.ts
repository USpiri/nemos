import {
  LinkOptions,
  linkOptions,
  type RouteOptions,
} from '@tanstack/react-router'
import { getNoteNameWithoutExtension } from '../notes'
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
    title:
      getNoteNameWithoutExtension(`${workspaceId}/${noteId}`) || 'Untitled',
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
