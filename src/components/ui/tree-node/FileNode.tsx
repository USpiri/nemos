import { splitFileName } from "@/utils/fs";
import { useEditableNode } from "./hooks/useEditableNode";
import { NodeWrapper } from "./components/NodeWrapper";
import { FileIcon } from "../file-icon/FileIcon";
import { EditableLabel } from "../editable-label/EditableLabel";
import { NodeModel } from "@/models/tree-node.interface";

interface Props {
  node: NodeModel;
  onClick?: () => void;
}

export const FileNode = ({ node, onClick }: Props) => {
  const { file, extension } = splitFileName(node.text);
  const { isEditing, setEditing, onChange, fileName } = useEditableNode(
    node,
    file,
    extension,
  );

  return (
    <NodeWrapper onClick={onClick}>
      <FileIcon fileName={node.text} className="h-4 w-4 shrink-0" />
      <span className="truncate" onDoubleClick={() => setEditing(true)}>
        <EditableLabel
          value={fileName}
          isEditing={isEditing}
          onBlur={onChange}
          onChange={onChange}
        />
        {extension && (
          <span className="text-foreground-faint">{extension}</span>
        )}
      </span>
    </NodeWrapper>
  );
};
