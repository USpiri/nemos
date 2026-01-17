import {
  ArrowUpRight,
  Copy,
  FilePlus,
  FolderOpen,
  FolderPlus,
  Pencil,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react'
import { useCallback } from 'react'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import { createNoteTab } from '@/lib/tabs'
import { useTabsStore } from '@/store'
import { useRenameStore } from '@/store/rename.store'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu'

interface Props {
  children: React.ReactNode
  isFolder: boolean
  workspace: string
  note: string
}

// TODO: implement a confirmation dialog or "hold to execute" for delete note and folder
export const TreeNodeContextMenu = ({
  children,
  isFolder,
  workspace,
  note,
}: Props) => {
  const {
    createNoteAndNavigate,
    createFolderAndRefresh,
    deleteNoteAndRefresh,
    deleteFolderAndRefresh,
    copyNote,
    navigateToNote,
    revealInExplorer,
  } = useWorkspaceActions({
    workspace,
  })
  const openNewTab = useTabsStore((s) => s.openNewTab)
  const setRenamingPath = useRenameStore((state) => state.setRenamingPath)

  const handleOpenNote = useCallback(() => {
    const tabData = createNoteTab({
      workspaceId: workspace,
      noteId: note,
    })
    openNewTab(tabData)
    navigateToNote(note)
  }, [workspace, note, openNewTab, navigateToNote])

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
        {isFolder ? (
          <>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => setRenamingPath(note)}
            >
              <Pencil className="text-foreground" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => createNoteAndNavigate(note)}
            >
              <FilePlus className="text-foreground" />
              New Note
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => createFolderAndRefresh(note)}
            >
              <FolderPlus className="text-foreground" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => revealInExplorer()}
            >
              <FolderOpen className="text-foreground" />
              Reveal in File Explorer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-xs"
              onClick={() => deleteFolderAndRefresh(note)}
              variant="destructive"
            >
              <Trash2 />
              Delete
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => navigateToNote(note)}
            >
              <ArrowUpRight className="text-foreground" />
              Open
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={handleOpenNote}
            >
              <SquareArrowOutUpRight className="text-foreground" />
              Open in New Tab
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => setRenamingPath(note)}
            >
              <Pencil className="text-foreground" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => copyNote(note)}
            >
              <Copy className="text-foreground" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => createNoteAndNavigate(note)}
            >
              <FilePlus className="text-foreground" />
              New Note
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => createFolderAndRefresh(note)}
            >
              <FolderPlus className="text-foreground" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
              onClick={() => revealInExplorer()}
            >
              <FolderOpen className="text-foreground" />
              Reveal in File Explorer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-xs"
              onClick={() => deleteNoteAndRefresh(note)}
              variant="destructive"
            >
              <Trash2 />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
