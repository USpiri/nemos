import { useCallback, useState } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface DeleteConfirmData {
  type: 'note' | 'folder'
  name: string
  title?: string
  onConfirm: () => Promise<void>
}

export const DeleteConfirmDialog = () => {
  const { close, isOpen, data } = useDialog()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteData = data as DeleteConfirmData | null
  const title =
    deleteData?.title ||
    `Delete ${deleteData?.type === 'folder' ? 'Folder' : 'Note'}`

  const handleConfirm = useCallback(async () => {
    if (!deleteData?.onConfirm) return

    setIsDeleting(true)
    try {
      await deleteData.onConfirm()
      close()
    } finally {
      setIsDeleting(false)
    }
  }, [deleteData, close])

  const handleClose = () => {
    if (!isDeleting) {
      close()
    }
  }

  return (
    <Dialog open={isOpen('delete-confirmation')} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <strong className="font-semibold text-foreground">
              {deleteData?.name}
            </strong>
            ? <br />
            {deleteData?.type === 'folder' && (
              <>
                <span>This will delete the folder and all its contents. </span>
                <br />
              </>
            )}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
