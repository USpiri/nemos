import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { WorkspaceFormDialog } from './WorkspaceFormDialog'

/**
 * GlobalDialogs component
 * Renders all global dialogs in the application
 * These dialogs can be opened from anywhere using the appropriate hooks
 */
export const GlobalDialogs = () => {
  return (
    <>
      <WorkspaceFormDialog />
      <DeleteConfirmDialog />
    </>
  )
}
