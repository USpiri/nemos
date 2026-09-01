import { Download, FolderPlus, PinIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePinWorkspace } from '@/hooks/use-pin-workspace'
import { useRootActions } from '@/hooks/use-root-actions'
import { rootFolderName } from '@/lib/paths'
import { findPinnedWorkspace, useWorkspaceRegistry } from '@/lib/workspace'

type Props = {
  rootPath: string
}

// TODO: Implement import notes
export const WorkspaceActions = ({ rootPath }: Props) => {
  const { createNoteAndNavigate, createFolderAndRefresh } = useRootActions()
  const { pinWorkspace } = usePinWorkspace()
  const isPinned = useWorkspaceRegistry(
    (state) => findPinnedWorkspace(state.workspaces, rootPath) !== undefined,
  )

  const handleImportNotes = () =>
    toast.info('Import notes is not implemented yet')

  const handlePin = () =>
    pinWorkspace(rootPath, undefined, () => {
      toast.success('Pinned as a Workspace', {
        description: rootFolderName(rootPath),
        richColors: true,
      })
    })

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
      {!isPinned && (
        <Button variant="outline" onClick={handlePin}>
          <PinIcon />
          Pin this Workspace
        </Button>
      )}
      <Button variant="ghost" onClick={handleImportNotes}>
        <Download />
        Import Notes
      </Button>
    </div>
  )
}
