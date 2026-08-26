import { useCallback } from 'react'
import { toast } from 'sonner'
import { openPath } from '@/lib/opener'

export const useOpenInExplorer = () => {
  const openInExplorer = useCallback(async (path: string) => {
    try {
      await openPath(path)
    } catch {
      toast.error('Failed to open in explorer')
    }
  }, [])

  return { openInExplorer }
}
