const TabTypes = {
  NOTE: 'note',
} as const
export type TabType = (typeof TabTypes)[keyof typeof TabTypes]

export interface BaseTab<Type extends TabType> {
  id: string
  type: Type
  title: string
  path: string
  dirty: boolean
  payload: unknown
}

export interface NoteTab extends BaseTab<'note'> {
  payload: {
    workspaceId: string
    noteId: string
  }
}

export type Tab = NoteTab
