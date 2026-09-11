import { useCallback } from 'react'
import { toast } from 'sonner'
import { useWorkspaceRegistry } from '@/lib/workspace'
import { WorkspaceError } from '@/lib/workspace/errors'

/**
 * Pins a folder as a Workspace via the registry's `pin` call (#86). Shared
 * by the "Add Workspace" flow (#87) and, later, the sidebar's "Pin this
 * Workspace" action on an open, unpinned Root.
 */
export const usePinWorkspace = () => {
  const pin = useWorkspaceRegistry((state) => state.pin)

  const pinWorkspace = useCallback(
    async (path: string, name?: string, onSuccess?: () => void) => {
      try {
        await pin(path, name)
        onSuccess?.()
      } catch (error) {
        if (error instanceof WorkspaceError && error.code === 'ALREADY_PINNED') {
          toast.warning('Already a Workspace', {
            description: error.message,
            richColors: true,
          })
          return
        }
        toast.error('Failed to add Workspace', {
          description: 'Please try again',
          richColors: true,
        })
      }
    },
    [pin],
  )

  return { pinWorkspace }
}
