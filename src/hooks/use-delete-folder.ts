import { useCallback } from 'react'
import { toast } from 'sonner'
import { deleteFolder as deleteFolderFn, NoteError } from '@/lib/notes'
import { getEntryName } from '@/lib/paths'
import { useDialog } from './use-dialog'

interface Props {
  workspaceId: string
}

export const useDeleteFolder = ({ workspaceId }: Props) => {
  const { open } = useDialog()

  const deleteFolder = useCallback(
    async (
      relativePath: string,
      options: { skipConfirmation?: boolean; onSuccess?: () => void } = {},
    ) => {
      const performDelete = async () => {
        try {
          await deleteFolderFn({ workspaceId, relativePath })
          options.onSuccess?.()
        } catch (error) {
          if (error instanceof NoteError) {
            switch (error.code) {
              case 'DELETE_FAILED':
                toast.error('Failed to delete folder', {
                  description: error.message,
                })
                break
            }
          } else {
            toast.error('Failed to delete folder')
          }
        }
      }

      if (options.skipConfirmation) {
        await performDelete()
      } else {
        const folderName = getEntryName(relativePath)
        open('delete-confirmation', {
          type: 'folder',
          name: folderName,
          onConfirm: performDelete,
        })
      }
    },
    [workspaceId, open],
  )
  return { deleteFolder }
}
