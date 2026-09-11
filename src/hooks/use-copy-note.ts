import { useCallback } from 'react'
import { toast } from 'sonner'
import { copyNote as copyNoteFn } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'

interface Props {
  rootPath: string
}

export const useCopyNote = ({ rootPath }: Props) => {
  const copyNote = useCallback(
    async (relativePath: string, onSuccess?: (notePath: string) => void) => {
      if (!relativePath) {
        toast.error('Note path is required')
        return
      }

      try {
        const path = toFsPath(rootPath, relativePath)
        const notePath = await copyNoteFn({ path })
        onSuccess?.(notePath)
      } catch {
        toast.error('Failed to copy note')
      }
    },
    [rootPath],
  )

  return { copyNote }
}
