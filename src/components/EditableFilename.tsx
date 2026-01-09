import { getNoteIdFromPath } from "@/lib/notes";
import {
  Editable,
  EditablePreview,
  EditableInput,
  EditableSubmit,
  EditableCancel,
  EditableToolbar,
} from "./ui/editable-text";
import { useParams } from "@tanstack/react-router";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";
import { useRenameStore } from "@/store/rename.store";

interface Props {
  display: string;
  path: string;
  suffix?: string;
  className?: string;
  isFolder?: boolean;
}

export const EditableFilename = ({
  display,
  path,
  suffix,
  className,
  isFolder = false,
}: Props) => {
  const { isRenaming, setRenamingPath } = useRenameStore();
  const { workspaceId } = useParams({ strict: false });
  const { renameNoteAndNavigate, renameFolderAndRefresh } = useWorkspaceActions(
    {
      workspace: workspaceId!,
    },
  );

  const noteId = getNoteIdFromPath(path);
  const shouldEdit = isRenaming(noteId);

  const handleSubmit = (value: string) => {
    if (isFolder) {
      renameFolderAndRefresh(noteId, value);
    } else {
      renameNoteAndNavigate(noteId, value);
    }
    setRenamingPath(null);
  };

  const handleCancel = () => {
    setRenamingPath(null);
  };

  return (
    <Editable
      defaultValue={display}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={shouldEdit}
    >
      <EditablePreview
        className={className}
        suffix={
          suffix ? (
            <span className="text-muted-foreground text-xs">{suffix}</span>
          ) : undefined
        }
      />
      <EditableInput className={className} />
      <EditableToolbar>
        <EditableSubmit />
        <EditableCancel />
      </EditableToolbar>
    </Editable>
  );
};
