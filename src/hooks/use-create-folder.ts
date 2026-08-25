import { useCallback } from 'react'
import { toast } from 'sonner'
import { createFolder as createFolderFn, NoteError } from '@/lib/notes'

interface Props {
  rootPath: string
}

export const useCreateFolder = ({ rootPath }: Props) => {
  const createFolder = useCallback(
    async (relativePath: string, onSuccess?: (folderPath: string) => void) => {
      try {
        const folderPath = await createFolderFn({ rootPath, relativePath })
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
    [rootPath],
  )

  return { createFolder }
}
