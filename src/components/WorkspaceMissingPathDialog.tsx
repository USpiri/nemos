import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import { useRelocateWorkspace } from '@/hooks/use-relocate-workspace'
import { openFolderDialog } from '@/lib/dialog'
import { useWorkspaceRegistry } from '@/lib/workspace'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface WorkspaceMissingPathData {
  path: string
  name: string
}

/**
 * Shown when a pinned Workspace's folder no longer resolves (#90), detected
 * lazily on open-attempt rather than an eager scan at launch.
 */
export const WorkspaceMissingPathDialog = () => {
  const { close, isOpen, data } = useDialog()
  const { relocateWorkspace } = useRelocateWorkspace()
  const unpin = useWorkspaceRegistry((state) => state.unpin)
  const navigate = useNavigate()
  const [isBusy, setIsBusy] = useState(false)

  const missingData = data as WorkspaceMissingPathData | null
  const open = isOpen('workspace-missing-path')

  const handleClose = useCallback(() => {
    if (!isBusy) close()
  }, [isBusy, close])

  const handleRetry = useCallback(() => {
    if (!missingData) return
    close()
    navigate({
      to: '/workspace/$rootPath',
      params: { rootPath: missingData.path },
    })
  }, [missingData, close, navigate])

  const handleRelocate = useCallback(async () => {
    if (!missingData) return

    const newPath = await openFolderDialog()
    if (!newPath) return

    setIsBusy(true)
    try {
      await relocateWorkspace(missingData.path, newPath, () => {
        close()
        navigate({
          to: '/workspace/$rootPath',
          params: { rootPath: newPath },
        })
      })
    } finally {
      setIsBusy(false)
    }
  }, [missingData, relocateWorkspace, close, navigate])

  const handleDeletePin = useCallback(async () => {
    if (!missingData) return

    setIsBusy(true)
    try {
      await unpin(missingData.path)
      close()
    } finally {
      setIsBusy(false)
    }
  }, [missingData, unpin, close])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace not found</DialogTitle>
          <DialogDescription>
            The folder for{' '}
            <strong className="font-semibold text-foreground">
              {missingData?.name}
            </strong>{' '}
            could not be found. It may have been moved, renamed, or is on a
            drive that isn&apos;t currently connected.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleDeletePin}
            disabled={isBusy}
          >
            Delete pin
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRetry}
            disabled={isBusy}
          >
            Retry
          </Button>
          <Button type="button" onClick={handleRelocate} disabled={isBusy}>
            Relocate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
