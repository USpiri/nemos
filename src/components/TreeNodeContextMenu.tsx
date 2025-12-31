import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  FolderPlus,
  FilePlus,
  Copy,
  Trash2,
  Pencil,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  isFolder: boolean;
  workspace: string;
  note: string;
}

export const TreeNodeContextMenu = ({
  children,
  isFolder,
  workspace,
  note,
}: Props) => {
  const handleCreateNote = async () => {
    console.log("Create note:", note, "workspace:", workspace);
    toast.info("Create note feature coming soon");
  };

  const handleCreateFolder = async () => {
    console.log("Create folder:", note);
    toast.info("Create folder feature coming soon");
  };

  const handleCopyNote = async () => {
    console.log("Copy note:", note);
    toast.info("Copy note feature coming soon");
  };

  const handleDeleteNote = async () => {
    console.log("Delete note:", note);
    toast.info("Delete note feature coming soon");
  };

  const handleDeleteFolder = async () => {
    console.log("Delete folder:", note);
    toast.info("Delete folder feature coming soon");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
        {isFolder ? (
          <>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={() => console.log("Rename folder")}
            >
              <Pencil className="text-foreground" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={handleCreateNote}
            >
              <FilePlus className="text-foreground" />
              New Note
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={handleCreateFolder}
            >
              <FolderPlus className="text-foreground" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={() => console.log("Reveal in File Explorer")}
            >
              <FolderOpen className="text-foreground" />
              Reveal in File Explorer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="rounded-none px-2 py-1.5 text-xs"
              onClick={handleDeleteFolder}
              variant="destructive"
            >
              <Trash2 />
              Delete
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={() => console.log("Open note")}
            >
              <ArrowUpRight className="text-foreground" />
              Open
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={() => console.log("Rename note")}
            >
              <Pencil className="text-foreground" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={handleCopyNote}
            >
              <Copy className="text-foreground" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={handleCreateNote}
            >
              <FilePlus className="text-foreground" />
              New Note
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={handleCreateFolder}
            >
              <FolderPlus className="text-foreground" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem
              className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
              onClick={() => console.log("Reveal in File Explorer")}
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
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
