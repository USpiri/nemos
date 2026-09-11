import { useCallback } from 'react'
import { toast } from 'sonner'
import { useDialog } from '@/hooks/use-dialog'
import {
  acceptPinsMigration,
  checkPinsMigration,
  declinePinsMigration,
} from '@/lib/workspace/service/migrate-pins'
import type { WorkspaceEntry } from '@/lib/workspace/workspace.type'
import { useDialogStore } from '@/store'

/**
 * Drives the one-time, opt-in pin migration prompt: checks once at
 * boot whether existing `nemos-app` subdirectories are still owed a
 * pin-or-skip decision, and carries out whichever choice the user makes.
 */
export const usePinsMigration = () => {
  const { open, close } = useDialog()

  const check = useCallback(async () => {
    try {
      const candidates = await checkPinsMigration()
      if (!candidates) return

      // The single-slot dialog store can race with another boot-time open
      // (e.g. the `$rootPath` loader's `workspace-missing-path` prompt, for
      // an upgrading user whose restored last route points at a pinned
      // Workspace that's gone missing). Skip rather than clobber — the
      // persisted flag is only set on explicit accept/decline, so this
      // retries on the next launch instead.
      if (useDialogStore.getState().dialog) return

      open('pins-migration', { candidates })
    } catch (error) {
      console.error('Failed to check pin migration', error)
    }
  }, [open])

  const accept = useCallback(
    async (candidates: WorkspaceEntry[]) => {
      try {
        await acceptPinsMigration(candidates)
      } catch {
        toast.error('Failed to pin existing folders', {
          description: 'Please try again, or pin them manually via Open Folder',
          richColors: true,
        })
      } finally {
        close()
      }
    },
    [close],
  )

  const decline = useCallback(async () => {
    await declinePinsMigration()
    close()
  }, [close])

  return { check, accept, decline }
}
