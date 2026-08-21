import { LazyStore } from '@tauri-apps/plugin-store'
import type { z } from 'zod'
import { create } from 'zustand'
import {
  ROOT_CONFIG_DIR,
  ROOT_SETTINGS_FILE,
  SETTINGS_FILE,
} from '@/config/constants'
import { ensureDir, readJson, writeJson } from '@/lib/fs'
import { resolveSettings } from './resolve-settings'
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

  let _rootPath: string | null = null
  let _globalData: Data | null = null

  const persistGlobal = async (data: Data) => {
    await store.set(def.key, { _meta: { version: def.version }, data })
    await store.save()
  }

  const loadRootDelta = async (rootPath: string): Promise<Partial<Data>> => {
    try {
      const all = await readJson<Record<string, Partial<Data>>>(
        `${rootPath}/${ROOT_SETTINGS_FILE}`,
      )
      return (all[def.key] as Partial<Data>) ?? {}
    } catch {
      return {}
    }
  }

  const removeRootDelta = async (rootPath: string) => {
    const settingsPath = `${rootPath}/${ROOT_SETTINGS_FILE}`
    let all: Record<string, unknown> = {}
    try {
      all = await readJson<Record<string, unknown>>(settingsPath)
    } catch {
      return
    }
    delete all[def.key]
    await writeJson(settingsPath, all)
  }

  const saveRootDelta = async (rootPath: string, patch: Partial<Data>) => {
    const configDir = `${rootPath}/${ROOT_CONFIG_DIR}`
    const settingsPath = `${rootPath}/${ROOT_SETTINGS_FILE}`
    await ensureDir(configDir, { recursive: true })
    let all: Record<string, unknown> = {}
    try {
      all = await readJson<Record<string, unknown>>(settingsPath)
    } catch {
      /* no existing settings, will create new */
    }
    all[def.key] = { ...(all[def.key] as Record<string, unknown>), ...patch }
    await writeJson(settingsPath, all)
  }

  // Unlike saveRootDelta (which merges a patch on top), this fully replaces
  // the scope's delta entry — needed for migrateRootDelta, which may rename
  // or drop keys rather than just add to them.
  const replaceRootDelta = async (rootPath: string, delta: Partial<Data>) => {
    const settingsPath = `${rootPath}/${ROOT_SETTINGS_FILE}`
    let all: Record<string, unknown> = {}
    try {
      all = await readJson<Record<string, unknown>>(settingsPath)
    } catch {
      /* no existing settings, will create new */
    }
    all[def.key] = delta
    await writeJson(settingsPath, all)
  }

  return create<ScopeStore<Data>>()((set) => ({
    ...def.defaults,
    _initialized: false,
    rootPath: null,
    rootDelta: {} as Partial<Data>,

    init: async (rootPath: string) => {
      _rootPath = rootPath

      const stored = await store.get<PersistedScope<unknown>>(def.key)
      let globalData: Data

      // If there's no existing stored data, initialize with defaults.
      // Otherwise, attempt to migrate and validate.
      if (!stored) {
        globalData = def.defaults
        await persistGlobal(globalData)
      } else {
        const storedVersion = stored._meta?.version ?? 0
        const migrated = runMigration<Data>(
          stored.data,
          storedVersion,
          def.version,
          def.migrate,
        )
        const parsed = def.schema.safeParse(migrated)
        globalData = parsed.success ? parsed.data : def.defaults

        // If migration or validation failed, persist the defaults to reset the global settings.
        if (!parsed.success) await persistGlobal(globalData)
      }

      _globalData = globalData

      let rootDelta = await loadRootDelta(rootPath)
      if (def.migrateRootDelta) {
        const migratedDelta = def.migrateRootDelta(rootDelta)
        if (migratedDelta !== rootDelta) {
          rootDelta = migratedDelta
          await replaceRootDelta(rootPath, rootDelta)
        }
      }
      const effective = resolveSettings(globalData, rootDelta)

      set({ ...effective, rootDelta, _initialized: true, rootPath } as Partial<ScopeStore<Data>>)
    },

    update: async (patch) => {
      const rootPath = _rootPath
      set((prev) => ({
        ...(patch as Partial<ScopeStore<Data>>),
        rootDelta: { ...prev.rootDelta, ...patch },
      }))
      if (rootPath) await saveRootDelta(rootPath, patch)
    },

    revertKey: async (key) => {
      const rootPath = _rootPath
      const globalData = _globalData ?? def.defaults

      set((prev) => {
        const nextDelta = { ...prev.rootDelta }
        delete nextDelta[key]
        return {
          [key]: globalData[key],
          rootDelta: nextDelta,
        } as Partial<ScopeStore<Data>>
      })

      if (rootPath) {
        const settingsPath = `${rootPath}/${ROOT_SETTINGS_FILE}`
        let all: Record<string, unknown> = {}
        try {
          all = await readJson<Record<string, unknown>>(settingsPath)
        } catch {
          return
        }
        const scopeDelta = { ...(all[def.key] as Record<string, unknown>) }
        delete scopeDelta[key as string]
        if (Object.keys(scopeDelta).length === 0) {
          delete all[def.key]
        } else {
          all[def.key] = scopeDelta
        }
        await writeJson(settingsPath, all)
      }
    },

    reset: async () => {
      const rootPath = _rootPath
      const globalData = _globalData ?? def.defaults
      if (rootPath) await removeRootDelta(rootPath)
      set({ ...globalData, rootDelta: {} } as Partial<ScopeStore<Data>>)
    },

    resetToDefaults: async () => {
      const rootPath = _rootPath
      if (rootPath) await removeRootDelta(rootPath)
      set({ ...def.defaults, rootDelta: {} } as Partial<ScopeStore<Data>>)
      await persistGlobal(def.defaults)
    },
  }))
}
