import { z } from 'zod'

export const NoteSchema = z.object({
  content: z.string(),
  readonly: z.boolean().optional(),
})
