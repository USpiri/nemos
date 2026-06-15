import { z } from 'zod'
import { createScope } from '../settings.service'

export const Themes = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const
export type Theme = (typeof Themes)[keyof typeof Themes]

export const AppearanceSettings = z.object({
  theme: z.enum(Themes),
  autoSyncTheme: z.boolean(),
  activeTheme: z.string().nullable().default(null),
  disabledGlobalSnippets: z.array(z.string()).default([]),
  disabledWorkspaceSnippets: z.array(z.string()).default([]),
})
export type AppearanceSettings = z.infer<typeof AppearanceSettings>

export const useAppearanceSettings = createScope({
  key: 'appearance',
  version: 1,
  schema: AppearanceSettings,
  defaults: {
    theme: Themes.SYSTEM,
    autoSyncTheme: true,
    activeTheme: null,
    disabledGlobalSnippets: [],
    disabledWorkspaceSnippets: [],
  },
})
