import { z } from 'zod'

const GeneralSchema = z.object({})

export type GeneralSettings = z.infer<typeof GeneralSchema>
