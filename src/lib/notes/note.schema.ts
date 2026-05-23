import { z } from 'zod'

export const FrontmatterSchema = z
  .object({
    readonly: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    cssClass: z.string().optional(),
  })
  .loose()

export const NoteSchema = z.object({
  frontmatter: FrontmatterSchema,
  content: z.string(),
})
