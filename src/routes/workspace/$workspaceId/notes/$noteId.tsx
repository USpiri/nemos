import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useNoteEditor } from '@/hooks/use-note-editor'
import type { Frontmatter, Note } from '@/lib/notes'
import { readNote } from '@/lib/notes'
import { createNoteTab } from '@/lib/tabs'
import { cn } from '@/lib/utils'
import { useTabsStore } from '@/store'
import { NoteError, NotePending } from './-components'
import { NoteProperties } from './-components/NoteProperties'

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

  return (
    <NoteView
      key={noteId}
      workspaceId={workspaceId}
      noteId={noteId}
      note={note}
    />
  )
}

function NoteView({
  workspaceId,
  noteId,
  note,
}: {
  workspaceId: string
  noteId: string
  note: Note
}) {
  const [frontmatter, setFrontmatter] = useState<Frontmatter>(note.frontmatter)

  const { save } = useNoteEditor({
    workspaceId,
    relativePath: noteId,
    initialContent: note.content,
    initialFrontmatter: note.frontmatter,
  })

  const handleFrontmatterChange = useCallback(
    (updated: Frontmatter) => {
      setFrontmatter(updated)
      save({ frontmatter: updated })
    },
    [save],
  )

  return (
    <main className={cn('note h-full', frontmatter.cssClass)}>
      <Suspense fallback={<NotePending />}>
        <NoteProperties
          className="mx-auto w-full max-w-3xl px-10 pt-20"
          frontmatter={frontmatter}
          onChange={handleFrontmatterChange}
        />
        <Editor
          content={note.content}
          className="mx-auto w-full max-w-3xl px-10 pt-8 pb-32"
          editable={!frontmatter.readonly}
          onUpdate={(content) => save({ content })}
        />
      </Suspense>
    </main>
  )
}
