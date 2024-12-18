import { Copy, FileText, Folder, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../context-menu";
import { ContextMenuHoldingItem } from "../../context-menu-holding-item";
import { ReactNode } from "react";
import { useSidebarActions } from "@/hooks/useSidebarActions";
import { NodeModel } from "@minoru/react-dnd-treeview";

interface Props {
  node: NodeModel;
  children?: ReactNode;
  onOpenChange: (state: boolean) => void;
}

// TODO:
// - Implement copy action
// - Prevent oppening menu while there is another meno oppened

export const TreeNodeMenu = ({ children, onOpenChange, node }: Props) => {
  const { createNote, createFolder } = useSidebarActions();
  const creationPath = (node.droppable ? node.id : node.parent).toString();

  const deleteAction = () => {
    console.log("Elemento eliminado");
  };

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => createNote(creationPath)}>
          <FileText className="mr-2 size-4" /> New note
        </ContextMenuItem>
        <ContextMenuItem onClick={() => createFolder(creationPath)}>
          <Folder className="mr-2 size-4" /> New folder
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 size-4" /> Copy note
        </ContextMenuItem>
        <ContextMenuHoldingItem
          label="Delete note"
          icon={<Trash2 className="mr-2 size-4" />}
          color="var(--destructive)"
          time={2000}
          onCompleteHolding={deleteAction}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
};
