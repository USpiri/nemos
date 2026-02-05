import { useCallback } from 'react'
import { toast } from 'sonner'
import {
  deleteFolder as deleteFolderFn,
  getNoteNameFromPath,
  NoteError,
} from '@/lib/notes'
import { useDialog } from './use-dialog'

interface Props {
  workspace: string
}

export const useDeleteFolder = ({ workspace }: Props) => {
  const { open } = useDialog()

  const deleteFolder = useCallback(
    async (folder: string, skipConfirmation = false) => {
      const performDelete = async () => {
        try {
          await deleteFolderFn({ workspace, folder })
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

      if (skipConfirmation) {
        await performDelete()
      } else {
        // Extract the folder name from the path for display
        const folderName = getNoteNameFromPath(folder)
        open('delete-confirmation', {
          type: 'folder',
          name: folderName,
          onConfirm: performDelete,
        })
      }
    },
    [workspace, open],
  )
  return { deleteFolder }
}
