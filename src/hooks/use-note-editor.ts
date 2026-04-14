import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { Note, NoteError, writeNote } from '@/lib/notes'

export const useNoteEditor = ({
  workspaceId,
  relativePath,
  initialContent,
}: {
  workspaceId: string
  relativePath: string
  initialContent: Note
}) => {
  const lastSaved = useRef(initialContent)

  const saveFn = useCallback(
    async (note: Note) => {
      if (lastSaved.current.content === note.content) return

      try {
        await writeNote(workspaceId, relativePath, note)
        lastSaved.current = note
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

  const save = useDebouncedCallback(saveFn, 500)

  useEffect(() => () => void save.flush(), [save])

  return { save }
}
