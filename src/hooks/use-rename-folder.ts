import { useCallback } from 'react'
import { toast } from 'sonner'
import { NoteError, renameFolder as renameFolderFn } from '@/lib/notes'

interface Props {
  workspaceId: string
}

export const useRenameFolder = ({ workspaceId }: Props) => {
  const renameFolder = useCallback(
    async (relativePath: string, newName: string) => {
      if (!relativePath || !newName) {
        toast.error('Folder and the new name are required')
        return
      }

      try {
        const folderPath = await renameFolderFn({
          workspaceId,
          relativePath,
          newName,
        })
        return folderPath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'RENAME_FAILED':
              toast.error('Failed to rename folder', {
                description: error.message,
              })
              break
            case 'NOT_FOUND':
              toast.error('Folder not found')
              break
          }
        }
      }
    },
    [workspaceId],
  )

  return { renameFolder }
}
