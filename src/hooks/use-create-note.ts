import { useCallback } from 'react'
import { toast } from 'sonner'
import { createNote as createNoteFn, NoteError } from '@/lib/notes'
import { toFsPath } from '@/lib/paths'

interface Props {
  rootPath: string
}

export const useCreateNote = ({ rootPath }: Props) => {
  const createNote = useCallback(
    async (relativePath: string, onSuccess?: (notePath: string) => void) => {
      try {
        const path = toFsPath(rootPath, relativePath)
        const notePath = await createNoteFn({ path })
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
    [rootPath],
  )

  return { createNote }
}
