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
// - Drag&Drop files and folders
// - Drag&Drop previews for files and folders
// - Drag&Drop zones colors

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

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((files) => setFiles(files));
  }, []);

  return (
    <div className="mt-5 w-full overflow-hidden p-2">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={files}
          rootId={"notes-app"}
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
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={console.log}
        />
      </DndProvider>
    </div>
  );
};
