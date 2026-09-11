import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useNoteEditor } from '@/hooks/use-note-editor'
import type { Frontmatter, Note } from '@/lib/notes'
import { readNote } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'
import { createNoteTab } from '@/lib/tabs'
import { cn } from '@/lib/utils'
import { useTabsStore } from '@/store'
import { NoteError, NotePending } from './-components'
import { NoteProperties } from './-components/NoteProperties'

const Editor = lazy(() =>
  import('@/components/editor/Editor').then((m) => ({ default: m.Editor })),
)

export const Route = createFileRoute('/workspace/$rootPath/notes/$noteId')({
  component: NoteIdComponent,
  pendingComponent: NotePending,
  errorComponent: NoteError,
  loader: async ({ params: { rootPath, noteId } }) => {
    return { note: await readNote(toFsPath(rootPath, noteId)) }
  },
})

function NoteIdComponent() {
  const { rootPath, noteId } = Route.useParams()
  const { note } = Route.useLoaderData()
  const openTab = useTabsStore((s) => s.openTab)

  useEffect(() => {
    const tabData = createNoteTab({ rootPath, noteId })
    openTab(tabData)
  }, [rootPath, noteId, openTab])

  return (
    <NoteView key={noteId} rootPath={rootPath} noteId={noteId} note={note} />
  )
}

function NoteView({
  rootPath,
  noteId,
  note,
}: {
  rootPath: string
  noteId: string
  note: Note
}) {
  const [frontmatter, setFrontmatter] = useState<Frontmatter>(note.frontmatter)

  const { save, saveNow } = useNoteEditor({
    rootPath,
    relativePath: noteId,
    initialContent: note.content,
    initialFrontmatter: note.frontmatter,
  })

  const handleFrontmatterChange = useCallback(
    (updated: Frontmatter) => {
      setFrontmatter(updated)
      saveNow({ frontmatter: updated })
    },
    [saveNow],
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
