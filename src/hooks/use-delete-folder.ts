import { useCallback } from 'react'
import { toast } from 'sonner'
import { deleteFolder as deleteFolderFn, NoteError } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useDeleteFolder = ({ workspace }: Props) => {
  const deleteFolder = useCallback(
    async (folder: string) => {
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
    },
    [workspace],
  )
  return { deleteFolder }
}
