import {
  getBackendOptions,
  MultiBackend,
  Tree,
  NodeModel,
} from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { TreeNode } from "./tree-node/TreeNode";
import { getTreeNodeFiles } from "@/utils/fs";

// TODO:
// - Effects of Drag&Drop files and folder (File System)

export const SidebarContent = () => {
  const [files, setFiles] = useState<NodeModel[]>([]);

  const loadChildrens = async (fileName: string) => {
    getTreeNodeFiles(`${fileName}`).then((res) => {
      setFiles([
        ...files,
        ...res.filter((i) => !files.map((i) => i.id).includes(i.id)),
      ]);
    });
  };

  const handleDrop = (tree: NodeModel[]) => setFiles(tree);

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((files) => setFiles(files));
  }, []);

  return (
    <div className="mt-5 w-full overflow-hidden p-2">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={files}
          rootId={"notes-app"}
          dropTargetOffset={5}
          render={(node, { depth, isOpen, onToggle }) => (
            <TreeNode
              node={node}
              isOpen={isOpen}
              depth={depth}
              onToggle={() => {
                onToggle();
                loadChildrens(node.id.toString());
              }}
            />
          )}
          canDrop={(_, { dragSource, dropTargetId }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          classes={{
            draggingSource: "opacity-20",
          }}
          onDrop={handleDrop}
          placeholderRender={(_, { depth }) => <Placeholder depth={depth} />}
        />
      </DndProvider>
    </div>
  );
};

interface PlaceholderProps {
  depth: number;
}

const Placeholder = ({ depth }: PlaceholderProps) => {
  return (
    <div
      className="absolute right-0 mx-2 h-0.5 bg-detail"
      style={{ left: depth * 15 }}
    />
  );
};
