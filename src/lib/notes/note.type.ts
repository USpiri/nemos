import { z } from 'zod'
import { NoteSchema } from './note.schema'

export type Note = z.infer<typeof NoteSchema>
