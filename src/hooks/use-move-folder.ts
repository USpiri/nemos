import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveFolder as moveFolderFn, NoteError } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useMoveFolder = ({ workspace }: Props) => {
  const moveFolder = useCallback(
    async (folder: string, destination: string) => {
      if (!folder) {
        toast.error('Folder is required')
        return
      }

      try {
        const folderPath = await moveFolderFn({
          workspace,
          folder,
          destination,
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
    [workspace],
  )

  return { moveFolder }
}
