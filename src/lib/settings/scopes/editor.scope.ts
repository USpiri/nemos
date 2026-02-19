import { z } from 'zod'
import { createScope } from '../settings.service'

export const EditorSettings = z.object({})
export type EditorSettings = z.infer<typeof EditorSettings>

export const useEditorSettings = createScope({
  key: 'editor',
  version: 1,
  schema: EditorSettings,
  defaults: {},
})
