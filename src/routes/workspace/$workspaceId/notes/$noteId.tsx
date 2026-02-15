import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Editor } from '@/components/editor'
import { useNoteEditor } from '@/hooks/use-note-editor'
import { readNote } from '@/lib/notes'
import { createNoteTab } from '@/lib/tabs'
import { useTabsStore } from '@/store'
import { NoteError, NotePending } from './-components'

export const Route = createFileRoute('/workspace/$workspaceId/notes/$noteId')({
  component: NoteIdComponent,
  pendingComponent: NotePending,
  errorComponent: NoteError,
  loader: ({ params: { workspaceId, noteId } }) =>
    readNote(`${workspaceId}/${noteId}`),
})

function NoteIdComponent() {
  const { workspaceId, noteId } = Route.useParams()
  const note = Route.useLoaderData()
  const openTab = useTabsStore((s) => s.openTab)

  // Sync URL to tabs: when navigating directly to a note URL, open the tab
  useEffect(() => {
    const tabData = createNoteTab({
      workspaceId,
      noteId,
    })
    openTab(tabData)
  }, [workspaceId, noteId, openTab])

  const { save } = useNoteEditor({
    path: `${workspaceId}/${noteId}`,
    initialContent: note,
  })

  return (
    <main>
      <Editor
        content={note.content}
        className="mx-auto w-full max-w-3xl px-10 py-32"
        onUpdate={(content) => save({ content })}
      />
    </main>
  )
}
