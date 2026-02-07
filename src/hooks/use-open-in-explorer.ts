import { useCallback } from 'react'
import { toast } from 'sonner'
import { openInExplorer as openInExplorerFn } from '@/lib/workspace'

export const useOpenInExplorer = () => {
  const openInExplorer = useCallback(
    async ({ workspace, note }: { workspace: string; note?: string }) => {
      try {
        await openInExplorerFn({ workspace, note })
      } catch {
        toast.error('Failed to open in explorer')
      }
    },
    [],
  )

  return { openInExplorer }
}
