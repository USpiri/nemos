import { EditableLabel } from "@/components/ui/editable-label/EditableLabel";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { getFilename, rename } from "@/utils/fs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const splitFileName = (str: string) => ({
  file: str.substring(0, str.lastIndexOf(".")),
  extension: str.substring(str.lastIndexOf("."), str.length),
});

export const Filename = () => {
  const [isEditing, setEditing] = useState(false);
  const { "*": splat } = useParams();
  const updateSidebarName = useSidebarStore((store) => store.updateNodeName);
  const navigate = useNavigate();
  const filename = getFilename(splat ?? "");
  const { file, extension } = splitFileName(filename);

  const onFilenameChange = async (value: string) => {
    if (!splat || value === file) return setEditing(false);
    const target = `${splat.substring(0, splat.lastIndexOf("/"))}/${value}${extension}`;
    await rename(splat, target).then(() => {
      setEditing(false);
      updateSidebarName(splat, target);
      navigate(`file/${target}`);
    });
  };

  return (
    <p
      className="text-sm text-foreground-muted"
      onDoubleClick={() => setEditing(true)}
    >
      <EditableLabel
        isEditing={isEditing}
        value={file}
        onBlur={onFilenameChange}
        onChange={onFilenameChange}
      />
      {/* {getFilename(splat ?? "")} */}
      <span>{extension}</span>
    </p>
  );
};
