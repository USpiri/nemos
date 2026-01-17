import { useCallback } from 'react'
import { toast } from 'sonner'
import { copyNote as copyNoteFn } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useCopyNote = ({ workspace }: Props) => {
  const copyNote = useCallback(
    async (noteName: string, onSuccess?: (notePath: string) => void) => {
      if (!noteName) {
        toast.error('Note name is required')
        return
      }

      try {
        const notePath = await copyNoteFn({
          workspace,
          path: noteName,
        })
        onSuccess?.(notePath)
      } catch (error) {
        toast.error('Failed to copy note')
      }
    },
    [workspace],
  )

  return { copyNote }
}
