import { z } from 'zod/v3'
import { fsNameSchema } from '../fs'

export const createWorkspaceSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  name: fsNameSchema,
})
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
