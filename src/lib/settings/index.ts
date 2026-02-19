export type { AppearanceSettings } from './scopes/appearance.scope'
export type { EditorSettings } from './scopes/editor.scope'
export type { GeneralSettings } from './scopes/general.scope'
export { createScope, store } from './settings.service'
export type {
  PersistedScope,
  ScopeDefinition,
  ScopeStore,
} from './settings.types'
