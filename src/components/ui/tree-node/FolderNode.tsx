import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEditableNode } from "./hooks/useEditableNode";
import { Folder, FolderOpen } from "lucide-react";
import { EditableLabel } from "../editable-label/EditableLabel";
import { NodeWrapper } from "./components/NodeWrapper";

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
