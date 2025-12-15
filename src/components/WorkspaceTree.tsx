import { NodeModel } from "@minoru/react-dnd-treeview";
import { Tree } from "./ui/tree";
import { WorkspaceTreeNode } from "./WorkspaceTreeNode";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

interface Props {
  tree: NodeModel[];
  root: string;
  workspace: string;
}

export const WorkspaceTree = ({ tree, root, workspace }: Props) => {
  return (
    <Tree
      tree={tree}
      rootId={`${root}/${workspace}`}
      render={(node, { depth, isOpen, onToggle }) => (
        <WorkspaceTreeNode
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
        </WorkspaceTreeNode>
      )}
      onDrop={console.log}
    />
  );
};
