import { NodeModel, NodeModelData } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { getTreeNodeFiles, move } from "@/utils/fs";
import { getPath, updateNodes } from "@/utils/tree-node";
import { DropOptions } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export const useSidebar = () => {
  const tree = useSidebarStore((store) => store.tree);
  const setTree = useSidebarStore((store) => store.setTree);
  const { "*": activeNote } = useParams();
  const navigate = useNavigate();

  const handleDrop = async (
    nodes: NodeModel[],
    options: DropOptions<NodeModelData>,
  ) => {
    const { dragSource, dropTarget, dropTargetId } = options;
    if (!dragSource) return;
    const sourcePath = getPath(dragSource as NodeModel);

    // dropTarget is undefined only when the node is dropped
    // on the "root" and dropTargetId is the root.
    const targetPath = dropTarget
      ? `${getPath(dropTarget as NodeModel)}/${dragSource.text}`
      : `${dropTargetId}/${dragSource.text}`;

    if (targetPath === sourcePath) return;

    const { updatedNodes, newActivePath } = updateNodes(
      nodes,
      targetPath,
      sourcePath,
      activeNote ?? "",
    );

    try {
      await move(sourcePath, targetPath).then(() => {
        if (activeNote === sourcePath) navigate(`/file/${targetPath}`);
        if (newActivePath) navigate(`/file/${newActivePath}`);
        setTree(updatedNodes);
      });
    } catch (e) {
      console.log("Failing update", e);
    }
  };

  useEffect(() => {
    getTreeNodeFiles("notes-app").then((nodes) => setTree(nodes));
  }, []);

  return {
    tree,
    handleDrop,
  };
};
