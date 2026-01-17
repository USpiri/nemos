import { useCallback } from 'react'
import { toast } from 'sonner'
import { createFolder as createFolderFn, NoteError } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useCreateFolder = ({ workspace }: Props) => {
  const createFolder = useCallback(
    async (folderName: string, onSuccess?: (folderPath: string) => void) => {
      try {
        const folderPath = await createFolderFn({
          workspace,
          path: folderName,
        })
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
    [workspace],
  )

  return { createFolder }
}
