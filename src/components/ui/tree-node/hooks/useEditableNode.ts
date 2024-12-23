import { NodeModel } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { rename } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
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
  const { "*": activeNoteId } = useParams();
  const tree = useSidebarStore((store) => store.tree);
  const setTree = useSidebarStore((store) => store.setTree);

  const restoreState = useCallback(() => {
    setEditing(false);
    setLabel(fileName);
  }, [fileName]);

  const onChange = async (value: string) => {
    if (value === label) return restoreState();
    setLabel(value);
    const target = `${node.data!.path}/${value}${extension}`;
    let newActivePath = "";

    try {
      setEditing(false);
      const nodePath = getPath(node);

      const updatedNodes = tree.map((node) => {
        // Update inner nodes only if dragSource is a folder (droppable)
        if (node.data!.path.includes(nodePath)) {
          const path = node.data!.path.replace(nodePath, target);
          if (getPath(node) === activeNoteId)
            newActivePath = `${target}/${node.text}`;
          const data = {
            ...node.data,
            path,
          };
          return { ...node, data } as NodeModel;
        }

        // Update current node
        if (nodePath === getPath(node)) {
          return {
            ...node,
            text: `${value}${extension}`,
            data: {
              ...node.data,
              path: target.substring(0, target.lastIndexOf("/")),
            },
          } as NodeModel;
        }

        // Other nodes
        return node;
      });

      await rename(nodePath, target).then(() => {
        setTree(updatedNodes);
        if (node.droppable && newActivePath) navigate(`file/${newActivePath}`);
        if (extension === ".note" && !node.droppable)
          navigate(`file/${target}`);
      });
    } catch (e) {
      console.log("Failing update", e);
      restoreState();
    }
  };

  return { isEditing, setEditing, onChange, fileName: label, extension };
};
