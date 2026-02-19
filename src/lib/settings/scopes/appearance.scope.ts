import { z } from 'zod'

export const AppearanceSettings = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  autoSyncTheme: z.boolean(),
})
export type AppearanceSettings = z.infer<typeof AppearanceSettings>
