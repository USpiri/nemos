import { useCallback } from 'react'
import { toast } from 'sonner'
import { NoteError, renameFolder as renameFolderFn } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useRenameFolder = ({ workspace }: Props) => {
  const renameFolder = useCallback(
    async (folder: string, newName: string) => {
      if (!folder || !newName) {
        toast.error('Folder and the new name are required')
        return
      }

      try {
        const folderPath = await renameFolderFn({ workspace, folder, newName })
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
    [workspace],
  )

  return { renameFolder }
}
