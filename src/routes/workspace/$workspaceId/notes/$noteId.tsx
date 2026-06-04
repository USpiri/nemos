import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'
import { useNoteEditor } from '@/hooks/use-note-editor'
import { readNote } from '@/lib/notes'
import { createNoteTab } from '@/lib/tabs'
import { cn } from '@/lib/utils'
import { useTabsStore } from '@/store'
import { NoteError, NotePending } from './-components'

const Editor = lazy(() =>
  import('@/components/editor/Editor').then((m) => ({ default: m.Editor })),
)

export const Route = createFileRoute('/workspace/$workspaceId/notes/$noteId')({
  component: NoteIdComponent,
  pendingComponent: NotePending,
  errorComponent: NoteError,
  loader: ({ params: { workspaceId, noteId } }) =>
    readNote(workspaceId, noteId),
})

function NoteIdComponent() {
  const { workspaceId, noteId } = Route.useParams()
  const note = Route.useLoaderData()
  const openTab = useTabsStore((s) => s.openTab)

  useEffect(() => {
    const tabData = createNoteTab({ workspaceId, noteId })
    openTab(tabData)
  }, [workspaceId, noteId, openTab])

  const { save } = useNoteEditor({
    workspaceId,
    relativePath: noteId,
    initialContent: note.content,
    initialFrontmatter: note.frontmatter,
  })

  return (
    <main className={cn('h-full', note.frontmatter.cssClass)}>
      <Suspense fallback={<NotePending />}>
        <Editor
          content={note.content}
          className="mx-auto w-full max-w-3xl px-10 pt-8 pb-32"
          editable={!note.frontmatter.readonly}
          onUpdate={(content) => save({ content })}
        />
      </Suspense>
    </main>
  )
}
