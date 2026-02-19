export {
  AppearanceSettings,
  type Theme,
  Themes,
  useAppearanceSettings,
} from './scopes/appearance.scope'
export { EditorSettings, useEditorSettings } from './scopes/editor.scope'
export {
  GeneralSettings,
  useGeneralSettings,
} from './scopes/general.scope'
export { createScope, store } from './settings.service'
export type {
  PersistedScope,
  ScopeDefinition,
  ScopeStore,
} from './settings.types'
