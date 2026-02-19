import { LazyStore } from '@tauri-apps/plugin-store'
import type { z } from 'zod'
import { create } from 'zustand'
import { SETTINGS_FILE } from '@/config/constants'
import type {
  PersistedScope,
  ScopeDefinition,
  ScopeStore,
} from './settings.types'

export const store = new LazyStore(SETTINGS_FILE)

function runMigration<T>(
  candidate: unknown,
  storedVersion: number,
  currentVersion: number,
  migrateFn?: (raw: unknown, fromVersion: number) => T,
): unknown {
  if (storedVersion < currentVersion && migrateFn) {
    return migrateFn(candidate, storedVersion)
  }
  return candidate
}

export function createScope<TSchema extends z.ZodObject>(
  def: ScopeDefinition<TSchema>,
) {
  type Data = z.infer<TSchema>

  const persist = async (data: Data) => {
    await store.set(def.key, { _meta: { version: def.version }, data })
    await store.save()
  }

  return create<ScopeStore<Data>>()((set, get) => ({
    ...def.defaults,
    _initialized: false,

    init: async () => {
      const stored = await store.get<PersistedScope<unknown>>(def.key)
      let data: Data

      if (!stored) {
        data = def.defaults
        await persist(data)
      } else {
        const storedVersion = stored._meta?.version ?? 0
        const migrated = runMigration<Data>(
          stored.data,
          storedVersion,
          def.version,
          def.migrate,
        )
        const parsed = def.schema.safeParse(migrated)
        data = parsed.success ? parsed.data : def.defaults
        if (!parsed.success) await persist(data)
      }

      set({ ...data, _initialized: true } as Partial<ScopeStore<Data>>)
    },

    update: async (patch) => {
      set(patch as Partial<ScopeStore<Data>>)
      const state = get()
      const snapshot = Object.fromEntries(
        Object.keys(def.defaults).map((k) => [
          k,
          state[k as keyof typeof state],
        ]),
      )
      const result = def.schema.safeParse(snapshot)
      const data: Data = result.success ? result.data : def.defaults
      await persist(data)
    },

    reset: async () => {
      set({ ...def.defaults } as Partial<ScopeStore<Data>>)
      await persist(def.defaults)
    },
  }))
}
