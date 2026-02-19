import { z } from 'zod'
import { createScope } from '../settings.service'

export const GeneralSettings = z.object({})
export type GeneralSettings = z.infer<typeof GeneralSettings>

export const useGeneralSettings = createScope({
  key: 'general',
  version: 1,
  schema: GeneralSettings,
  defaults: {},
})
