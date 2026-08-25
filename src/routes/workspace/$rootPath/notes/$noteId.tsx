import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useNoteEditor } from '@/hooks/use-note-editor'
import type { Frontmatter, Note } from '@/lib/notes'
import { readNote } from '@/lib/notes'
import { rootFolderName } from '@/lib/paths'
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
    const folderName = rootFolderName(rootPath)
    return { note: await readNote(folderName, noteId), folderName }
  },
})

function NoteIdComponent() {
  const { rootPath, noteId } = Route.useParams()
  const { note, folderName } = Route.useLoaderData()
  const openTab = useTabsStore((s) => s.openTab)

  useEffect(() => {
    const tabData = createNoteTab({ rootPath, noteId })
    openTab(tabData)
  }, [rootPath, noteId, openTab])

  return (
    <NoteView
      key={noteId}
      rootFolderName={folderName}
      noteId={noteId}
      note={note}
    />
  )
}

function NoteView({
  rootFolderName,
  noteId,
  note,
}: {
  rootFolderName: string
  noteId: string
  note: Note
}) {
  const [frontmatter, setFrontmatter] = useState<Frontmatter>(note.frontmatter)

  const { save, saveNow } = useNoteEditor({
    workspaceId: rootFolderName,
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
