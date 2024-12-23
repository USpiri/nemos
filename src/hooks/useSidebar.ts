import { NodeModel, NodeModelData } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { getTreeNodeFiles, move } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
import { DropOptions } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export const useSidebar = () => {
  const tree = useSidebarStore((store) => store.tree);
  const setTree = useSidebarStore((store) => store.setTree);
  const { "*": activeNoteId } = useParams();
  const navigate = useNavigate();

  const handleDrop = async (
    nodes: NodeModel[],
    options: DropOptions<NodeModelData>,
  ) => {
    const { dragSource, dropTarget, dropTargetId, dragSourceId } = options;
    if (!dragSource) return;
    const sourcePath = getPath(dragSource as NodeModel);
    let newActivePath = "";

    // dropTarget is undefined only when the node is dropped
    // on the "root" and dropTargetId is the root.
    const targetPath = dropTarget
      ? `${getPath(dropTarget as NodeModel)}/${dragSource.text}`
      : `${dropTargetId}/${dragSource.text}`;

    if (targetPath === sourcePath) return;

    const updatedNodes = nodes.map((node) => {
      // Update inner nodes only if dragSource is a folder (droppable)
      if (node.data!.path.includes(sourcePath) && dragSource.droppable) {
        const path = node.data!.path.replace(sourcePath, targetPath);
        if (getPath(node) === activeNoteId)
          newActivePath = `${targetPath}/${node.text}`;
        const data = {
          ...node.data,
          path,
        };
        return { ...node, data } as NodeModel;
      }

      // Update dropped node
      if (node.id === dragSourceId) {
        return {
          ...node,
          data: {
            ...node.data,
            path: targetPath.substring(0, targetPath.lastIndexOf("/")),
          },
        } as NodeModel;
      }

      // Other nodes
      return node;
    });

    await move(sourcePath, targetPath).then(() => {
      if (activeNoteId === sourcePath) navigate(`/file/${targetPath}`);
      if (newActivePath) navigate(`/file/${newActivePath}`);
    });

    setTree(updatedNodes);
  };

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((nodes) => setTree(nodes));
  }, []);

  return {
    tree,
    handleDrop,
  };
};
