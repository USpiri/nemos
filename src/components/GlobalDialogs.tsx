import { AddWorkspaceDialog } from './AddWorkspaceDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { SettingsDialog } from './settings/SettingsDialog'

/**
 * GlobalDialogs component
 * Renders all global dialogs in the application
 * These dialogs can be opened from anywhere using the appropriate hooks
 */
export const GlobalDialogs = () => {
  return (
    <>
      <AddWorkspaceDialog />
      <DeleteConfirmDialog />
      <SettingsDialog />
    </>
  )
}
