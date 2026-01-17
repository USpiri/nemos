import { FilePlus, FolderOpen, FolderPlus, RefreshCw } from 'lucide-react'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu'

interface Props {
  children: React.ReactNode
  workspace: string
}

export const TreeContextMenu = ({ children, workspace }: Props) => {
  const {
    createNoteAndNavigate,
    createFolderAndRefresh,
    refreshWorkspace,
    revealInExplorer,
  } = useWorkspaceActions({
    workspace,
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={() => createNoteAndNavigate()}
        >
          <FilePlus className="text-foreground" />
          New Note
        </ContextMenuItem>
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={() => createFolderAndRefresh()}
        >
          <FolderPlus className="text-foreground" />
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={() => revealInExplorer()}
        >
          <FolderOpen className="text-foreground" />
          Reveal in File Explorer
        </ContextMenuItem>
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={() => refreshWorkspace()}
        >
          <RefreshCw className="text-foreground" />
          Refresh
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
