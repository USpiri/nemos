import { useFiles } from "@/hooks/useFiles";
import { NodeModel } from "@/models/tree-node.interface";
import { getExtension } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
import { Copy, FileText, Folder, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../context-menu";
import { ContextMenuHoldingItem } from "../../context-menu-holding-item";

interface Props {
  node: NodeModel;
  children?: ReactNode;
  onOpenChange: (state: boolean) => void;
}

// TODO:
// - Prevent oppening menu while there is another meno oppened

export const TreeNodeMenu = ({ children, onOpenChange, node }: Props) => {
  const {
    createNote,
    createFolder,
    copyFile,
    deleteFile: deleteFileAction,
    deleteFolder,
  } = useFiles();
  const creationPath = node.droppable ? getPath(node) : node.data!.path;

  const deleteNode = async (path: string) => {
    if (node.droppable) {
      await deleteFolder(path);
    } else {
      await deleteFileAction(path);
    }
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
        {!node.droppable && getExtension(node.text) === ".note" && (
          <ContextMenuItem onClick={() => copyFile(getPath(node))}>
            <Copy className="mr-2 size-4" /> Copy note
          </ContextMenuItem>
        )}
        <ContextMenuHoldingItem
          label={node.droppable ? "Delete folder" : "Delete"}
          icon={<Trash2 className="mr-2 size-4" />}
          color="var(--destructive)"
          time={1000}
          onCompleteHolding={async () => await deleteNode(getPath(node))}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
};
