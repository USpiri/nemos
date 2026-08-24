import { FilePlus, FolderOpen, FolderPlus, RefreshCw } from 'lucide-react'
import { useRootActions } from '@/hooks/use-root-actions'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu'

interface Props {
  children: React.ReactNode
  root: string
}

export const TreeContextMenu = ({ children, root }: Props) => {
  const {
    createNoteAndNavigate,
    createFolderAndRefresh,
    refreshRoot,
    revealInExplorer,
  } = useRootActions({
    root,
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => createNoteAndNavigate()}
        >
          <FilePlus className="text-foreground" />
          New Note
        </ContextMenuItem>
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => createFolderAndRefresh()}
        >
          <FolderPlus className="text-foreground" />
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => revealInExplorer()}
        >
          <FolderOpen className="text-foreground" />
          Reveal in File Explorer
        </ContextMenuItem>
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => refreshRoot()}
        >
          <RefreshCw className="text-foreground" />
          Refresh
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
