import { useParams } from '@tanstack/react-router'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import { toRelativePath } from '@/lib/paths'
import { useRenameStore } from '@/store/rename.store'
import {
  Editable,
  EditableCancel,
  EditableInput,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
} from './ui/editable-text'

interface Props {
  display: string
  /** The full path of the note or folder. */
  path: string
  suffix?: string
  className?: string
  isFolder?: boolean
  context?: string
}

export const EditableFilename = ({
  display,
  path,
  suffix,
  className,
  isFolder = false,
  context,
}: Props) => {
  const { isRenaming, setRenamingPath } = useRenameStore()
  const { workspaceId } = useParams({ strict: false })
  const { renameNoteAndNavigate, renameFolderAndRefresh } = useWorkspaceActions(
    {
      workspace: workspaceId!,
    },
  )

  const relativePath = toRelativePath(path)
  const shouldEdit = isRenaming(relativePath, context)

  const handleSubmit = (value: string) => {
    if (isFolder) {
      renameFolderAndRefresh(relativePath, value)
    } else {
      renameNoteAndNavigate(relativePath, value)
    }
    setRenamingPath(null)
  }

  const handleCancel = () => {
    setRenamingPath(null)
  }

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
  )
}
