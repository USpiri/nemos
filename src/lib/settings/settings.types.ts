import type { z } from 'zod'

export interface ScopeDefinition<TSchema extends z.ZodObject> {
  key: string
  version: number
  schema: TSchema
  defaults: z.infer<TSchema>
  migrate?: (raw: unknown, fromVersion: number) => z.infer<TSchema>
  /**
   * One-time rename/shape fix for keys inside a Root's own delta file
   * (`.config/settings.json`), which `migrate` above does not see. Runs
   * right after the delta is loaded; if it changes the object, the result
   * is persisted back so it only runs once per Root.
   */
  migrateRootDelta?: (
    raw: Partial<z.infer<TSchema>>,
  ) => Partial<z.infer<TSchema>>
}

export interface PersistedScope<T> {
  _meta: { version: number }
  data: T
}

export type ScopeStore<T> = T & {
  _initialized: boolean
  rootPath: string | null
  rootDelta: Partial<T>
  init: (rootPath: string) => Promise<void>
  update: (patch: Partial<T>) => Promise<void>
  revertKey: (key: keyof T) => Promise<void>
  reset: () => Promise<void>
  resetToDefaults: () => Promise<void>
}
