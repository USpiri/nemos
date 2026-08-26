import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveFolder as moveFolderFn, NoteError } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'

interface Props {
  rootPath: string
}

export const useMoveFolder = ({ rootPath }: Props) => {
  const moveFolder = useCallback(
    async (relativePath: string, destinationPath: string) => {
      if (!relativePath) {
        toast.error('Folder is required')
        return
      }

      try {
        const fromPath = toFsPath(rootPath, relativePath)
        const toDir = toFsPath(rootPath, destinationPath)
        const folderPath = await moveFolderFn({ fromPath, toDir })
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
    [rootPath],
  )

  return { moveFolder }
}
