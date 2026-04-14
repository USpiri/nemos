import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveFolder as moveFolderFn, NoteError } from '@/lib/notes'

interface Props {
  workspaceId: string
}

export const useMoveFolder = ({ workspaceId }: Props) => {
  const moveFolder = useCallback(
    async (relativePath: string, destinationPath: string) => {
      if (!relativePath) {
        toast.error('Folder is required')
        return
      }

      try {
        const folderPath = await moveFolderFn({
          workspaceId,
          relativePath,
          destinationPath,
        })
        return folderPath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'RENAME_FAILED':
              toast.error('Failed to move folder', {
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

  return { moveFolder }
}
