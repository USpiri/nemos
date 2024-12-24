import { NodeModel } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { rename } from "@/utils/fs";
import { getPath, updateNodes } from "@/utils/tree-node";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const useEditableNode = (
  node: NodeModel,
  fileName: string,
  extension = "",
) => {
  const [label, setLabel] = useState(fileName);
  const [isEditing, setEditing] = useState(false);
  const navigate = useNavigate();
  const { "*": activeNote } = useParams();
  const nodes = useSidebarStore((store) => store.tree);
  const setTree = useSidebarStore((store) => store.setTree);

  const restoreState = useCallback(() => {
    setEditing(false);
    setLabel(fileName);
  }, [fileName]);

  const onChange = async (value: string) => {
    if (value === label) return restoreState();
    setLabel(value);

    const targetPath = `${node.data!.path}/${value}${extension}`;
    const sourcePath = getPath(node);
    setEditing(false);

    const { updatedNodes, newActivePath } = updateNodes(
      nodes,
      targetPath,
      sourcePath,
      activeNote ?? "",
      `${value}${extension}`,
    );

    try {
      await rename(sourcePath, targetPath).then(() => {
        setTree(updatedNodes);
        if (node.droppable && newActivePath) navigate(`file/${newActivePath}`);
        if (extension === ".note" && !node.droppable)
          navigate(`file/${targetPath}`);
      });
    } catch (e) {
      console.log("Failing update", e);
      restoreState();
    }
  };

  return { isEditing, setEditing, onChange, fileName: label, extension };
};
