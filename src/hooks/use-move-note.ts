import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveNote as moveNoteFn, NoteError } from '@/lib/notes'

interface Props {
  rootPath: string
}

export const useMoveNote = ({ rootPath }: Props) => {
  const moveNote = useCallback(
    async (relativePath: string, destinationPath: string) => {
      if (!relativePath) {
        toast.error('Note is required')
        return
      }

      try {
        const notePath = await moveNoteFn({
          rootPath,
          relativePath,
          destinationPath,
        })
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
    [rootPath],
  )

  return { moveNote }
}
