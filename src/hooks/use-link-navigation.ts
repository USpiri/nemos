import { getRouteApi } from '@tanstack/react-router'
import { useCallback, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import type { LinkNavigationOptions } from '@/components/editor/extensions/link/link-options'
import { ensureDir } from '@/lib/fs'
import { createNote, NoteError } from '@/lib/notes'
import { getParentPath, toFsPath, toRelativePath } from '@/lib/paths'
import { useRootActions } from './use-root-actions'

const rootRoute = getRouteApi('/workspace/$rootPath')
const noteRoute = getRouteApi('/workspace/$rootPath/notes/$noteId')

/**
 * Supplies the Link extension (ADR-0011) with everything it needs to
 * resolve and follow Note/Heading Anchor links relative to the Note
 * currently open: the existing Note paths already loaded for the sidebar
 * tree (so existence checks are synchronous, no extra fs round-trips), and
 * navigate/create-Note callbacks that replace the current Tab rather than
 * opening a new one (the route's own `openTab` effect does the replacing —
 * see routes/workspace/$rootPath/notes/$noteId.tsx).
 *
 * `noteExists` reads through a ref rather than closing over `rootTree`
 * directly: Tiptap's `useEditor` only re-reads its `extensions` option when
 * its own deps (Editor.tsx uses `[content]`) change, so the `Link` instance
 * baked into a live editor is otherwise frozen with whatever `noteExists`
 * existed when the Note was first opened. A same-identity function that
 * reads a ref kept fresh on every render sidesteps that entirely — a Note
 * created/renamed/deleted elsewhere in the Root (via `refreshRoot`,
 * updating `rootTree`) is reflected without needing the editor rebuilt.
 * (`onNavigateToNote`/`onCreateNote` don't need the same treatment: their
 * only "state" is `rootPath`, which is stable for the Note's whole open
 * lifetime — a `rootPath` change always implies a different `content`
 * prop too, which does rebuild the editor.)
 */
export const useLinkNavigation = (): LinkNavigationOptions => {
  const { rootPath, noteId } = noteRoute.useParams()
  const { rootTree } = rootRoute.useLoaderData()
  const { navigateToNote, refreshRoot } = useRootActions()

  const existingNotePaths = useMemo(
    () =>
      new Set(
        rootTree
          .filter((entry) => !entry.droppable)
          .map((entry) => toRelativePath(entry.id.toString(), rootPath)),
      ),
    [rootTree, rootPath],
  )

  const existingNotePathsRef = useRef(existingNotePaths)
  existingNotePathsRef.current = existingNotePaths

  const noteExists = useCallback(
    (relativePath: string) => existingNotePathsRef.current.has(relativePath),
    [],
  )

  const onNavigateToNote = useCallback(
    (relativePath: string, options?: { anchor?: string }) => {
      navigateToNote(relativePath, options?.anchor)
    },
    [navigateToNote],
  )

  const onCreateNote = useCallback(
    async (relativePath: string) => {
      try {
        const parentRelativePath = getParentPath(relativePath)
        if (parentRelativePath) {
          await ensureDir(toFsPath(rootPath, parentRelativePath))
        }
        await createNote({ path: toFsPath(rootPath, relativePath) })
        refreshRoot()
        onNavigateToNote(relativePath)
      } catch (error) {
        if (error instanceof NoteError) toast.error('Failed to create note')
      }
    },
    [rootPath, refreshRoot, onNavigateToNote],
  )

  return {
    rootPath,
    currentNotePath: noteId,
    noteExists,
    onNavigateToNote,
    onCreateNote,
  }
}
