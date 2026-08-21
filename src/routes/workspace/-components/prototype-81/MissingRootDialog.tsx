// PROTOTYPE for issue #81 — mechanics per #80: Relocate / Delete pin / Retry.
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Code } from '@/components/ui/typography'
import { type MockWorkspace } from './mock-data'

type Props = {
  workspace: MockWorkspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MissingRootDialog({ workspace, open, onOpenChange }: Props) {
  const [isChecking, setIsChecking] = useState(false)

  if (!workspace) return null

  const handleRetry = async () => {
    setIsChecking(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsChecking(false)
    toast.error('Still not found', {
      description: `${workspace.path} doesn't exist (prototype: always fails).`,
    })
  }

  const handleRelocate = () => {
    toast.success('Would open a native folder picker', {
      description: `On pick, "${workspace.name}" repoints to the new path — same dedupe-with-warning as Pin.`,
    })
    onOpenChange(false)
  }

  const handleDelete = () => {
    toast('Pin deleted', {
      description: `"${workspace.name}" removed from Workspaces. The folder itself is untouched.`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Can&apos;t find &ldquo;{workspace.name}&rdquo;</DialogTitle>
          <DialogDescription>
            This Workspace was pinned at <Code>{workspace.path}</Code>, but
            that folder isn&apos;t there anymore. It may have been moved,
            renamed, or is on a drive that isn&apos;t connected.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleRetry}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Retry'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isChecking}
            >
              Delete pin
            </Button>
          </div>
          <Button type="button" onClick={handleRelocate} disabled={isChecking}>
            Relocate…
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
