import { useState } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import { usePinsMigration } from '@/hooks/use-pins-migration'
import type { WorkspaceEntry } from '@/lib/workspace/workspace.type'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface PinsMigrationData {
  candidates: WorkspaceEntry[]
}

/**
 * One-time, opt-in prompt offering to pin existing `nemos-app`
 * subdirectories as Workspaces post-upgrade. Forces an explicit Pin/Start
 * Fresh choice — no close button or backdrop dismissal — since either
 * answer permanently gates whether this dialog ever shows again.
 */
export const PinsMigrationDialog = () => {
  const { isOpen, data } = useDialog()
  const { accept, decline } = usePinsMigration()
  const [isBusy, setIsBusy] = useState(false)

  const open = isOpen('pins-migration')
  const candidates = (data as PinsMigrationData | null)?.candidates ?? []

  const handleAccept = async () => {
    setIsBusy(true)
    try {
      await accept(candidates)
    } finally {
      setIsBusy(false)
    }
  }

  const handleDecline = async () => {
    setIsBusy(true)
    try {
      await decline()
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Pin your existing folders?</DialogTitle>
          <DialogDescription>
            Nemos found {candidates.length}{' '}
            {candidates.length === 1 ? 'folder' : 'folders'} you were already
            using. Pin them as Workspaces for quick access, or start fresh with
            none pinned — you can always pin a folder later via Open Folder.
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2 text-sm">
          {candidates.map((candidate) => (
            <li key={candidate.path} className="truncate">
              {candidate.name}
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDecline}
            disabled={isBusy}
          >
            Start Fresh
          </Button>
          <Button type="button" onClick={handleAccept} disabled={isBusy}>
            Pin All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
