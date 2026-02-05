import { useCallback } from 'react'
import { toast } from 'sonner'
import {
  deleteNote as deleteNoteFn,
  getNoteNameFromPath,
  NoteError,
} from '@/lib/notes'
import { useDialog } from './use-dialog'

interface Props {
  workspace: string
}

export const useDeleteNote = ({ workspace }: Props) => {
  const { open } = useDialog()

  const deleteNote = useCallback(
    async (note: string, skipConfirmation = false) => {
      const performDelete = async () => {
        try {
          await deleteNoteFn({ workspace, note })
        } catch (error) {
          if (error instanceof NoteError) {
            switch (error.code) {
              case 'DELETE_FAILED':
                toast.error('Failed to delete note', {
                  description: error.message,
                })
                break
            }
          } else {
            toast.error('Failed to delete note')
          }
        }
      }

      if (skipConfirmation) {
        await performDelete()
      } else {
        // Extract the note name from the path for display
        const noteName = getNoteNameFromPath(note)
        open('delete-confirmation', {
          type: 'note',
          name: noteName,
          onConfirm: performDelete,
        })
      }
    },
    [workspace, open],
  )
  return { deleteNote }
}
