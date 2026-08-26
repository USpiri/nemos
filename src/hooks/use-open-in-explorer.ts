import { useCallback } from 'react'
import { toast } from 'sonner'
import { revealPath } from '@/lib/opener'

export const useOpenInExplorer = () => {
  const openInExplorer = useCallback(async (path: string) => {
    try {
      await revealPath(path)
    } catch (error) {
      console.error('Failed to open in explorer', error)
      toast.error('Failed to open in explorer')
    }
  }, [])

  return { openInExplorer }
}
