import { z } from 'zod/v3'

export const addWorkspaceSchema = z.object({
  path: z.string().min(1, 'Choose a folder'),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
})
export type AddWorkspaceInput = z.infer<typeof addWorkspaceSchema>
