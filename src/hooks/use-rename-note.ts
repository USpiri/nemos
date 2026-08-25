import { useCallback } from 'react'
import { toast } from 'sonner'
import { NoteError, renameNote as renameNoteFn } from '@/lib/notes'

interface Props {
  rootPath: string
}

export const useRenameNote = ({ rootPath }: Props) => {
  const renameNote = useCallback(
    async (relativePath: string, newName: string) => {
      if (!relativePath || !newName) {
        toast.error('Note and the new name are required')
        return
      }

      try {
        const notePath = await renameNoteFn({
          rootPath,
          relativePath,
          newName,
        })
        return notePath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'RENAME_FAILED':
              toast.error('Failed to rename note', {
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

  return { renameNote }
}
