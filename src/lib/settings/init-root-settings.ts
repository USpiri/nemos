import { useAppearanceSettings } from './scopes/appearance.scope'
import { useEditorSettings } from './scopes/editor.scope'
import { useGeneralSettings } from './scopes/general.scope'

export const initRootSettings = (rootPath: string) =>
  Promise.all([
    useAppearanceSettings.getState().init(rootPath),
    useEditorSettings.getState().init(rootPath),
    useGeneralSettings.getState().init(rootPath),
  ])
