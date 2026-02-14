import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveNote as moveNoteFn, NoteError } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useMoveNote = ({ workspace }: Props) => {
  const moveNote = useCallback(
    async (note: string, destination: string) => {
      if (!note) {
        toast.error('Note is required')
        return
      }

      try {
        const notePath = await moveNoteFn({ workspace, note, destination })
        return notePath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'RENAME_FAILED':
              toast.error('Failed to move note', {
                description: error.message,
              })
              break
            case 'NOT_FOUND':
              toast.error('Note not found')
              break
          }
        }
      }
    },
    [workspace],
  )

  return { moveNote }
}
