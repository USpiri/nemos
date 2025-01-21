import { NodeModel } from "@/models/tree-node.interface";
import { Folder, FolderOpen } from "lucide-react";
import { EditableLabel } from "../editable-label/EditableLabel";
import { NodeWrapper } from "./components/NodeWrapper";
import { useEditableNode } from "./hooks/useEditableNode";

const ICON_CLASSES = "h-4 w-4 shrink-0";

interface Props {
  node: NodeModel;
  isOpen: boolean;
  onClick?: () => void;
}

export const FolderNode = ({ isOpen, node, onClick }: Props) => {
  const { isEditing, setEditing, onChange, fileName } = useEditableNode(
    node,
    node.text,
  );

  return (
    <NodeWrapper onClick={onClick}>
      {isOpen ? (
        <FolderOpen className={ICON_CLASSES} />
      ) : (
        <Folder className={ICON_CLASSES} />
      )}
      <span className="truncate" onDoubleClick={() => setEditing(true)}>
        <EditableLabel
          value={fileName}
          isEditing={isEditing}
          onBlur={onChange}
          onChange={onChange}
        />
      </span>
    </NodeWrapper>
  );
};
