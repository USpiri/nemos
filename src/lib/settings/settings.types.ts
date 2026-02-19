import type { z } from 'zod'

export interface ScopeDefinition<TSchema extends z.ZodObject> {
  key: string
  version: number
  schema: TSchema
  defaults: z.infer<TSchema>
  migrate?: (raw: unknown, fromVersion: number) => z.infer<TSchema>
}

export interface PersistedScope<T> {
  _meta: { version: number }
  data: T
}

export type ScopeStore<T> = T & {
  _initialized: boolean
  init: () => Promise<void>
  update: (patch: Partial<T>) => Promise<void>
  reset: () => Promise<void>
}
