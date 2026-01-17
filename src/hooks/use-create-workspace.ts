import { useCallback } from 'react'
import { toast } from 'sonner'
import { createWorkspace as createWorkspaceFn } from '@/lib/workspace'
import { WorkspaceError } from '@/lib/workspace/errors'

export const useCreateWorkspace = () => {
  const createWorkspace = useCallback(
    async (workspace: string, onSuccess?: () => void) => {
      try {
        await createWorkspaceFn(workspace)
        onSuccess?.()
      } catch (error) {
        if (error instanceof WorkspaceError) {
          switch (error.code) {
            case 'ALREADY_EXISTS':
              toast.error('Workspace already exists', {
                description: 'Please choose a different name',
                richColors: true,
              })
              break
            case 'INVALID_NAME':
              toast.error('Invalid workspace name', {
                description: 'Please choose a valid name',
                richColors: true,
              })
              break
            default:
              toast.error('Failed to create workspace', {
                description: 'Please try again',
                richColors: true,
              })
          }
        } else {
          toast.error('Failed to create workspace', {
            description: 'Please try again',
            richColors: true,
          })
        }
      }
    },
    [],
  )

  return { createWorkspace }
}
