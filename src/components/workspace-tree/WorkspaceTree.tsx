import { NodeModel } from "@minoru/react-dnd-treeview";
import { Tree } from "../ui/tree";
import { TreeNode } from "./TreeNode";
import { TreeContextMenu } from "./TreeContextMenu";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { getNoteIdFromPath } from "@/lib/notes";
import { FILE_EXTENSION } from "@/config/constants";
import { EditableFilename } from "../EditableFilename";

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
            note={getNoteIdFromPath(node.id.toString())}
            onToggle={onToggle}
          >
            {node.droppable ? (
              <>{isOpen ? <ChevronDown /> : <ChevronRight />}</>
            ) : (
              <FileText />
            )}
            <EditableFilename
              display={node.text.replace(FILE_EXTENSION, "")}
              path={node.id.toString()}
              suffix={node.droppable ? undefined : FILE_EXTENSION}
              className="p-0"
              isFolder={!!node.droppable}
            />
          </TreeNode>
        )}
        onDrop={console.log}
      />
    </TreeContextMenu>
  );
};
