import { useParams } from '@tanstack/react-router'
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
import { useRootActions } from '@/hooks/use-root-actions'
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
  root: string
  note: string
}

export const TreeNodeContextMenu = ({
  children,
  isFolder,
  root,
  note,
}: Props) => {
  const {
    createNoteAndNavigate,
    createFolderAndRefresh,
    deleteNoteAndRefresh,
    copyNote,
    navigateToNote,
    revealInExplorer,
    deleteNote,
    refreshRoot,
  } = useRootActions({
    root,
  })
  const { rootPath } = useParams({ strict: false })
  const openNewTab = useTabsStore((s) => s.openNewTab)
  const closeTab = useTabsStore((s) => s.closeTab)
  const setRenamingPath = useRenameStore((state) => state.setRenamingPath)

  const handleOpenNote = useCallback(() => {
    const tabData = createNoteTab({
      rootPath: rootPath!,
      noteId: note,
    })
    openNewTab(tabData)
    navigateToNote(note)
  }, [rootPath, note, openNewTab, navigateToNote])

  const handleDeleteNote = useCallback(() => {
    closeTab(note)
    deleteNote(note, { onSuccess: refreshRoot })
  }, [closeTab, deleteNote, note, refreshRoot])

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
              onClick={() => revealInExplorer(note)}
            >
              <FolderOpen className="text-foreground" />
              Reveal in File Explorer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-xs"
              onClick={handleDeleteNote}
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
              onClick={() => revealInExplorer(note)}
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
