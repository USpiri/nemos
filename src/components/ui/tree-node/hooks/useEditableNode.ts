import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { rename } from "@/utils/fs";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import { useNavigate } from "react-router";

export const useEditableNode = (
  node: NodeModel,
  fileName: string,
  extension = "",
) => {
  const [label, setLabel] = useState(fileName);
  const [isEditing, setEditing] = useState(false);
  const updateNodeName = useSidebarStore((store) => store.updateNodeName);
  const navigate = useNavigate();

  const restoreState = () => {
    setEditing(false);
    setLabel(fileName);
  };

  const onChange = async (value: string) => {
    setLabel(value);
    if (value === fileName) return restoreState();
    const target = `${node.parent}/${value}${extension}`;

    try {
      setEditing(false);
      await rename(node.id.toString(), target);
      updateNodeName(node.id.toString(), target);
      if (extension === ".note") navigate(`file/${target}`);
    } catch {
      restoreState();
    }
  };

  return { isEditing, setEditing, onChange, fileName: label, extension };
};
