import { NodeModel } from "@minoru/react-dnd-treeview";
import cn from "@/utils/cn";
import { getPath } from "@/utils/tree-node";
import { useNavigate, useParams } from "react-router";
import { getExtension } from "@/utils/fs";
import { FolderNode } from "./FolderNode";
import { FileNode } from "./FileNode";

interface Props {
  depth: number;
  node: NodeModel;
  isOpen: boolean;
  onToggle: () => void;
}

export const TreeNode = ({ depth, node, isOpen, onToggle }: Props) => {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const isActive = path === getPath(node);

  return (
    <div
      style={{ paddingInlineStart: depth * 10 }}
      className={cn(
        "group cursor-pointer rounded text-sm text-foreground-muted",
        isActive
          ? "bg-background-primary-alt text-foreground"
          : "hover:bg-background-primary-hover hover:text-foreground",
      )}
    >
      {node.droppable ? (
        <FolderNode isOpen={isOpen} node={node} onClick={() => onToggle()} />
      ) : (
        <FileNode
          node={node}
          onClick={() => {
            const path = getPath(node);
            if (getExtension(path) !== ".note") return;
            navigate(`file/${path}`);
          }}
        />
      )}
    </div>
  );
};
