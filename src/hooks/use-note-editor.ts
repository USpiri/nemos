import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import type { Frontmatter } from '@/lib/notes'
import { NoteError, writeNote } from '@/lib/notes'

export const useNoteEditor = ({
  workspaceId,
  relativePath,
  initialContent,
  initialFrontmatter,
}: {
  workspaceId: string
  relativePath: string
  initialContent: string
  initialFrontmatter: Frontmatter
}) => {
  const lastSaved = useRef({
    content: initialContent,
    frontmatter: initialFrontmatter,
  })

  const saveFn = useCallback(
    async (update: { content?: string; frontmatter?: Frontmatter }) => {
      const next = {
        content: update.content ?? lastSaved.current.content,
        frontmatter: update.frontmatter ?? lastSaved.current.frontmatter,
      }

      // Skip save only when content unchanged AND no explicit frontmatter update
      if (
        lastSaved.current.content === next.content &&
        update.frontmatter === undefined
      ) {
        return
      }

      try {
        await writeNote(workspaceId, relativePath, next)
        lastSaved.current = next
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'INVALID_CONTENT':
              toast.error('Invalid note content')
              break
            default:
              toast.error('Failed to save note')
          }
        } else {
          toast.error('Failed to save note')
        }
      }
    },
    [workspaceId, relativePath],
  )

  const save = useDebouncedCallback(saveFn, 1000)

  useEffect(() => () => void save.flush(), [save])

  return { save }
}
