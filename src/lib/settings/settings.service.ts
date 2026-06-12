import { LazyStore } from '@tauri-apps/plugin-store'
import type { z } from 'zod'
import { create } from 'zustand'
import {
  SETTINGS_FILE,
  WORKSPACE_CONFIG_DIR,
  WORKSPACE_SETTINGS_FILE,
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

  let _workspacePath: string | null = null
  let _globalData: Data | null = null

  const persistGlobal = async (data: Data) => {
    await store.set(def.key, { _meta: { version: def.version }, data })
    await store.save()
  }

  const loadWorkspaceDelta = async (
    workspacePath: string,
  ): Promise<Partial<Data>> => {
    try {
      const all = await readJson<Record<string, Partial<Data>>>(
        `${workspacePath}/${WORKSPACE_SETTINGS_FILE}`,
      )
      return (all[def.key] as Partial<Data>) ?? {}
    } catch {
      return {}
    }
  }

  const removeWorkspaceDelta = async (workspacePath: string) => {
    const settingsPath = `${workspacePath}/${WORKSPACE_SETTINGS_FILE}`
    let all: Record<string, unknown> = {}
    try {
      all = await readJson<Record<string, unknown>>(settingsPath)
    } catch {
      return
    }
    delete all[def.key]
    await writeJson(settingsPath, all)
  }

  const saveWorkspaceDelta = async (
    workspacePath: string,
    patch: Partial<Data>,
  ) => {
    const configDir = `${workspacePath}/${WORKSPACE_CONFIG_DIR}`
    const settingsPath = `${workspacePath}/${WORKSPACE_SETTINGS_FILE}`
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

  return create<ScopeStore<Data>>()((set) => ({
    ...def.defaults,
    _initialized: false,

    init: async (workspacePath: string) => {
      _workspacePath = workspacePath

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

      const workspaceDelta = await loadWorkspaceDelta(workspacePath)
      const effective = resolveSettings(globalData, workspaceDelta)

      set({ ...effective, _initialized: true } as Partial<ScopeStore<Data>>)
    },

    update: async (patch) => {
      const workspacePath = _workspacePath
      set(patch as Partial<ScopeStore<Data>>)
      if (workspacePath) await saveWorkspaceDelta(workspacePath, patch)
    },

    reset: async () => {
      const workspacePath = _workspacePath
      const globalData = _globalData ?? def.defaults
      if (workspacePath) await removeWorkspaceDelta(workspacePath)
      set({ ...globalData } as Partial<ScopeStore<Data>>)
    },

    resetToDefaults: async () => {
      const workspacePath = _workspacePath
      if (workspacePath) await removeWorkspaceDelta(workspacePath)
      set({ ...def.defaults } as Partial<ScopeStore<Data>>)
      await persistGlobal(def.defaults)
    },
  }))
}
