import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFiles } from "@/hooks/useFiles";
import { FileText, Folder } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export const SidebarContentMenu = ({ children }: Props) => {
  const { createFolder, createNote } = useFiles();
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full overflow-hidden overflow-y-auto">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => createNote()}>
          <FileText className="mr-2 size-4" /> New note
        </ContextMenuItem>
        <ContextMenuItem onClick={() => createFolder()}>
          <Folder className="mr-2 size-4" /> New folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
