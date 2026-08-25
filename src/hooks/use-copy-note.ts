import { useCallback } from 'react'
import { toast } from 'sonner'
import { copyNote as copyNoteFn } from '@/lib/notes'

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
        const notePath = await copyNoteFn({ rootPath, relativePath })
        onSuccess?.(notePath)
      } catch {
        toast.error('Failed to copy note')
      }
    },
    [rootPath],
  )

  return { copyNote }
}
