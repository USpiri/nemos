import { z } from 'zod'
import { FrontmatterSchema, NoteSchema } from './note.schema'

export type Frontmatter = z.infer<typeof FrontmatterSchema>
export type Note = z.infer<typeof NoteSchema>
