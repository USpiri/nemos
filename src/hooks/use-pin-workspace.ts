import { useCallback } from 'react'
import { toast } from 'sonner'
import { useWorkspaceRegistry } from '@/lib/workspace'
import { WorkspaceError } from '@/lib/workspace/errors'

/**
 * Pins an open Root as a Workspace via the registry's `pin` call (#86).
 * Shared by the "Create new Workspace" flow (#87) and, later, the sidebar's
 * "Pin this Workspace" action on an open, unpinned Root.
 */
export const usePinWorkspace = () => {
  const pin = useWorkspaceRegistry((state) => state.pin)

  const pinWorkspace = useCallback(
    async (path: string, onSuccess?: () => void) => {
      try {
        await pin(path)
        onSuccess?.()
      } catch (error) {
        if (error instanceof WorkspaceError && error.code === 'ALREADY_PINNED') {
          toast.warning('Already pinned', {
            description: 'This folder is already pinned as a Workspace',
            richColors: true,
          })
          return
        }
        toast.error('Failed to pin Workspace', {
          description: 'Please try again',
          richColors: true,
        })
      }
    },
    [pin],
  )

  return { pinWorkspace }
}
