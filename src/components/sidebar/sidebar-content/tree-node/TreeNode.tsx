import { FileNode, FolderNode } from "./file-node/FileNode";
import { NodeModel } from "@minoru/react-dnd-treeview";

interface Props {
  depth: number;
  node: NodeModel;
  isOpen: boolean;
  onToggle: () => void;
}

export const TreeNode = ({ depth, node, isOpen, onToggle }: Props) => {
  return (
    <div
      style={{ paddingInlineStart: depth * 10 }}
      className="cursor-pointer rounded text-sm text-foreground-darker hover:bg-neutral-700/30 hover:text-foreground"
    >
      {node.droppable ? (
        <FolderNode
          isOpen={isOpen}
          text={node.text}
          onClick={() => onToggle()}
        />
      ) : (
        <FileNode text={node.text} path={node.id.toString()} />
      )}
    </div>
  );
};
