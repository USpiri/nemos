import { AppearanceSettings } from '@/lib/settings/scopes/appearance.scope'
import { createScope } from '@/lib/settings/settings.service'

export const useAppearanceSettings = createScope({
  key: 'appearance',
  version: 1,
  schema: AppearanceSettings,
  defaults: { theme: 'system', autoSyncTheme: true },
})
