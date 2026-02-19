import { z } from 'zod'

const EditorSchema = z.object({})

export type EditorSettings = z.infer<typeof EditorSchema>
