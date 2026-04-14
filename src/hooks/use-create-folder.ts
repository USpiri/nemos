import { useCallback } from 'react'
import { toast } from 'sonner'
import { createFolder as createFolderFn, NoteError } from '@/lib/notes'

interface Props {
  workspaceId: string
}

export const useCreateFolder = ({ workspaceId }: Props) => {
  const createFolder = useCallback(
    async (relativePath: string, onSuccess?: (folderPath: string) => void) => {
      try {
        const folderPath = await createFolderFn({ workspaceId, relativePath })
        onSuccess?.(folderPath)
        return folderPath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'CREATE_FAILED':
              toast.error('Failed to create folder')
              break
          }
        }
      }
    },
    [workspaceId],
  )

  return { createFolder }
}
