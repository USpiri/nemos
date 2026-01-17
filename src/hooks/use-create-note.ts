import { useCallback } from 'react'
import { toast } from 'sonner'
import { FILE_EXTENSION } from '@/config/constants'
import { createNote as createNoteFn, NoteError } from '@/lib/notes'

interface Props {
  workspace: string
}

export const useCreateNote = ({ workspace }: Props) => {
  const createNote = useCallback(
    async (noteName: string, onSuccess?: (notePath: string) => void) => {
      try {
        const notePath = await createNoteFn({
          workspace,
          path: `${noteName}${FILE_EXTENSION}`,
        })
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
    [workspace],
  )

  return { createNote }
}
