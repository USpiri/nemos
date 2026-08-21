import { LinkOptions, linkOptions } from '@tanstack/react-router'
import { getBaseName } from '@/lib/paths'
import type { NoteTab, Tab } from './tab.type'

export const createNoteTab = ({
  rootPath,
  noteId,
}: {
  rootPath: string
  noteId: string
}): NoteTab => {
  return {
    id: noteId,
    type: 'note',
    title: getBaseName(noteId) || 'Untitled',
    path: `workspace/${rootPath}/notes/${noteId}`,
    dirty: false,
    payload: { rootPath, noteId },
  }
}

export const buildNavigationFromTab = (tab: Tab): LinkOptions => {
  switch (tab.type) {
    case 'note':
      return linkOptions({
        to: '/workspace/$rootPath/notes/$noteId',
        params: {
          rootPath: tab.payload.rootPath as string,
          noteId: tab.payload.noteId as string,
        },
      })
    default:
      return linkOptions({
        to: '/',
      })
  }
}
