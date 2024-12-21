import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { getTreeNodeFiles, move } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
import { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export const useSidebar = () => {
  const tree = useSidebarStore((store) => store.tree);
  const mergeTree = useSidebarStore((store) => store.mergeTree);
  const setTree = useSidebarStore((store) => store.setTree);
  const { "*": activeNoteId } = useParams();
  const navigate = useNavigate();

  const handleDrop = async (nodes: NodeModel[], options: DropOptions) => {
    const { dragSource, dropTarget, dropTargetId } = options;
    if (!dragSource) return;

    const sourcePath = getPath(dragSource);
    const targetPath = dropTarget
      ? `${getPath(dropTarget)}/${dragSource.text}`
      : `${dropTargetId}/${dragSource.text}`;

    const updatedNodes = nodes.map((node) => {
      return getPath(node) === targetPath ? { ...node, id: targetPath } : node;
    });

    if (sourcePath !== targetPath) {
      await move(sourcePath, targetPath).then(() => {
        if (activeNoteId === sourcePath) navigate(`/file/${targetPath}`);
      });
    }
    setTree(updatedNodes);
  };

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((nodes) => setTree(nodes));
  }, []);

  return {
    tree,
    mergeTree,
    handleDrop,
  };
};
