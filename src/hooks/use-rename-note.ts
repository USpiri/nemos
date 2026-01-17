import { useCallback } from 'react'
import { toast } from 'sonner'
import { NoteError, renameNote as renameNoteFn } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useRenameNote = ({ workspace }: Props) => {
  const renameNote = useCallback(
    async (note: string, newName: string) => {
      if (!note || !newName) {
        toast.error('Note and the new name are required')
        return
      }

      try {
        const notePath = await renameNoteFn({ workspace, note, newName })
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
    [workspace],
  )

  return { renameNote }
}
