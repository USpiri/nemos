import { useCallback } from 'react'
import { toast } from 'sonner'
import { useWorkspaceRegistry } from '@/lib/workspace'
import { WorkspaceError } from '@/lib/workspace/errors'

/**
 * Relocates a pinned Workspace to a new path, keeping its display name.
 */
export const useRelocateWorkspace = () => {
  const relocate = useWorkspaceRegistry((state) => state.relocate)

  const relocateWorkspace = useCallback(
    async (path: string, newPath: string, onSuccess?: () => void) => {
      try {
        await relocate(path, newPath)
        onSuccess?.()
      } catch (error) {
        if (
          error instanceof WorkspaceError &&
          error.code === 'ALREADY_PINNED'
        ) {
          toast.warning('Already a Workspace', {
            description: error.message,
            richColors: true,
          })
          return
        }
        toast.error('Failed to relocate Workspace', {
          description: 'Please try again',
          richColors: true,
        })
      }
    },
    [relocate],
  )

  return { relocateWorkspace }
}
