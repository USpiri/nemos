import { useCallback } from 'react'
import { toast } from 'sonner'
import { copyNote as copyNoteFn } from '@/lib/notes'

interface Props {
  workspaceId: string
}

export const useCopyNote = ({ workspaceId }: Props) => {
  const copyNote = useCallback(
    async (relativePath: string, onSuccess?: (notePath: string) => void) => {
      if (!relativePath) {
        toast.error('Note path is required')
        return
      }

      try {
        const notePath = await copyNoteFn({ workspaceId, relativePath })
        onSuccess?.(notePath)
      } catch {
        toast.error('Failed to copy note')
      }
    },
    [workspaceId],
  )

  return { copyNote }
}
