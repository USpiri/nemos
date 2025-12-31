import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { FolderPlus, FilePlus, FolderOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  workspace: string;
}

export const TreeContextMenu = ({ children, workspace }: Props) => {
  const handleCreateNote = async () => {
    console.log("Create note:", workspace);
    toast.info("Create note feature coming soon");
  };

  const handleCreateFolder = async () => {
    console.log("Create folder:", workspace);
    toast.info("Create folder feature coming soon");
  };

  const handleRefresh = () => {
    console.log("Refresh tree");
    toast.info("Refresh feature coming soon");
  };

  const handleRevealInExplorer = () => {
    console.log("Reveal workspace in File Explorer");
    toast.info("Reveal in File Explorer feature coming soon");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
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
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={handleRevealInExplorer}
        >
          <FolderOpen className="text-foreground" />
          Reveal in File Explorer
        </ContextMenuItem>
        <ContextMenuItem
          className="text-muted-foreground rounded-none px-2 py-1.5 text-xs"
          onClick={handleRefresh}
        >
          <RefreshCw className="text-foreground" />
          Refresh
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
