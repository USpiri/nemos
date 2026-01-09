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

interface Props {
  display: string;
  path: string;
  suffix?: string;
  className?: string;
}

export const EditableFilename = ({
  display,
  path,
  suffix,
  className,
}: Props) => {
  const { workspaceId } = useParams({ strict: false });
  const { renameNoteAndNavigate } = useWorkspaceActions({
    workspace: workspaceId!,
  });

  const handleSubmit = (value: string) => {
    renameNoteAndNavigate(getNoteIdFromPath(path), value);
  };

  return (
    <Editable defaultValue={display} onSubmit={handleSubmit}>
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
