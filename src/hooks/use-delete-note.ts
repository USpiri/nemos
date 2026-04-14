import { useCallback } from 'react'
import { toast } from 'sonner'
import { deleteNote as deleteNoteFn, NoteError } from '@/lib/notes'
import { getEntryName } from '@/lib/paths'
import { useDialog } from './use-dialog'

interface Props {
  workspaceId: string
}

export const useDeleteNote = ({ workspaceId }: Props) => {
  const { open } = useDialog()

  const deleteNote = useCallback(
    async (
      relativePath: string,
      options: { skipConfirmation?: boolean; onSuccess?: () => void } = {},
    ) => {
      const performDelete = async () => {
        try {
          await deleteNoteFn({ workspaceId, relativePath })
          options.onSuccess?.()
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

      if (options.skipConfirmation) {
        await performDelete()
      } else {
        const noteName = getEntryName(relativePath)
        open('delete-confirmation', {
          type: 'note',
          name: noteName,
          onConfirm: performDelete,
        })
      }
    },
    [workspaceId, open],
  )
  return { deleteNote }
}
