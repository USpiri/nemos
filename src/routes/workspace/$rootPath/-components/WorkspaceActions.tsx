import { Download, FolderPlus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRootActions } from '@/hooks/use-root-actions'

// TODO: Implement import notes
export const WorkspaceActions = () => {
  const { createNoteAndNavigate, createFolderAndRefresh } = useRootActions()

  const handleImportNotes = () =>
    toast.info('Import notes is not implemented yet')

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button onClick={() => createNoteAndNavigate()}>
        <Plus />
        New Note
      </Button>
      <Button variant="outline" onClick={() => createFolderAndRefresh()}>
        <FolderPlus />
        New Folder
      </Button>
      <Button variant="ghost" onClick={handleImportNotes}>
        <Download />
        Import Notes
      </Button>
    </div>
  )
}
