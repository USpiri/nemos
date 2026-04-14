import { useCallback } from 'react'
import { toast } from 'sonner'
import { createNote as createNoteFn, NoteError } from '@/lib/notes'

interface Props {
  workspaceId: string
}

export const useCreateNote = ({ workspaceId }: Props) => {
  const createNote = useCallback(
    async (relativePath: string, onSuccess?: (notePath: string) => void) => {
      try {
        const notePath = await createNoteFn({ workspaceId, relativePath })
        onSuccess?.(notePath)
        return notePath
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case 'CREATE_FAILED':
              toast.error('Failed to create note')
              break
          }
        }
      }
    },
    [workspaceId],
  )

  return { createNote }
}
