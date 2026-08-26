import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { openFolderDialog } from '@/lib/dialog'

/**
 * Lets the user pick any folder on disk and opens it as the active Root
 * (#85). Navigating to it replaces whatever Root was previously open, since
 * only one Root is ever open at a time.
 */
export const useOpenFolder = () => {
  const navigate = useNavigate()

  const openFolder = useCallback(async () => {
    const rootPath = await openFolderDialog()
    if (!rootPath) return
    navigate({ to: '/workspace/$rootPath', params: { rootPath } })
  }, [navigate])

  return { openFolder }
}
