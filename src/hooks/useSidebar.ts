import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { getTreeNodeFiles, move } from "@/utils/fs";
import { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";

export const useSidebar = () => {
  const tree = useSidebarStore((store) => store.tree);
  const mergeTree = useSidebarStore((store) => store.mergeTree);

  const loadChildrens = async (fileName: string) => {
    await getTreeNodeFiles(fileName).then((nodes) => mergeTree(nodes));
  };

  const handleDrop = async (nodes: NodeModel[], options: DropOptions) => {
    const { dragSource, dropTarget, dropTargetId } = options;
    if (!dragSource) return;

    const sourcePath = `${dragSource.parent}/${dragSource.text}`;
    const targetPath = dropTarget
      ? `${dropTarget.parent}/${dropTarget.text}/${dragSource.text}`
      : `${dropTargetId}/${dragSource.text}`;

    await move(sourcePath, targetPath);

    mergeTree(nodes);
  };

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((nodes) => mergeTree(nodes));
  }, []);

  return {
    tree,
    mergeTree,
    loadChildrens,
    handleDrop,
  };
};
