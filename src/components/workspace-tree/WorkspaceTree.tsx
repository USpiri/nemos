import { NodeModel } from "@minoru/react-dnd-treeview";
import { Tree } from "../ui/tree";
import { TreeNode } from "./TreeNode";
import { TreeContextMenu } from "./TreeContextMenu";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

interface Props {
  tree: NodeModel[];
  root: string;
  workspace: string;
}

export const WorkspaceTree = ({ tree, root, workspace }: Props) => {
  return (
    <TreeContextMenu workspace={workspace}>
      <Tree
        tree={tree}
        rootId={`${root}/${workspace}`}
        render={(node, { depth, isOpen, onToggle }) => (
          <TreeNode
            depth={depth}
            isOpen={isOpen}
            isDroppable={!!node.droppable}
            workspace={workspace}
            note={node.id.toString().split("/").slice(2).join("/")}
            onToggle={onToggle}
          >
            {node.droppable ? (
              <>{isOpen ? <ChevronDown /> : <ChevronRight />}</>
            ) : (
              <FileText />
            )}
            {node.text}
          </TreeNode>
        )}
        onDrop={console.log}
      />
    </TreeContextMenu>
  );
};
