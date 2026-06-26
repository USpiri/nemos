import { useAppearanceSettings } from './scopes/appearance.scope'
import { useEditorSettings } from './scopes/editor.scope'
import { useGeneralSettings } from './scopes/general.scope'

export const initWorkspaceSettings = (workspacePath: string) =>
  Promise.all([
    useAppearanceSettings.getState().init(workspacePath),
    useEditorSettings.getState().init(workspacePath),
    useGeneralSettings.getState().init(workspacePath),
  ])
