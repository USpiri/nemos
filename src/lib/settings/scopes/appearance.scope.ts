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
  disabledRootSnippets: z.array(z.string()).default([]),
})
export type AppearanceSettings = z.infer<typeof AppearanceSettings>

export const useAppearanceSettings = createScope({
  key: 'appearance',
  version: 2,
  schema: AppearanceSettings,
  defaults: {
    theme: Themes.SYSTEM,
    autoSyncTheme: true,
    activeTheme: null,
    disabledGlobalSnippets: [],
    disabledRootSnippets: [],
  },
  // One-time rename of the pre-#84 `disabledWorkspaceSnippets` key inside a
  // Root's own delta file (`.config/settings.json`), which the global
  // `migrate` hook can't see since it only runs against the global blob.
  migrateRootDelta: (raw) => {
    const legacy = raw as Partial<AppearanceSettings> & {
      disabledWorkspaceSnippets?: string[]
    }
    if (legacy.disabledWorkspaceSnippets === undefined) return raw
    const { disabledWorkspaceSnippets, ...rest } = legacy
    return { ...rest, disabledRootSnippets: disabledWorkspaceSnippets }
  },
})
