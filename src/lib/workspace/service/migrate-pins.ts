import { ROOT } from '@/config/constants'
import { readDir } from '@/lib/fs'
import { toAbsoluteRootPath } from '@/lib/paths'
import { store } from '@/lib/settings'
import { WorkspaceError } from '../errors'
import type { WorkspacePin } from '../workspace.type'
import { useWorkspaceRegistry } from '../workspace-registry'

const PROMPTED_KEY = 'pinsMigrationPrompted'

const setPinsMigrationPrompted = async () => {
  await store.set(PROMPTED_KEY, true)
  await store.save()
}

/**
 * Existing `nemos-app` subdirectories eligible for the one-time post-upgrade
 * pin migration — the same directory shape `getWorkspaces()` scanned
 * before the pin registry replaced it, minus hidden folders.
 */
const getMigrationCandidates = async (): Promise<WorkspacePin[]> => {
  const entries = await readDir(ROOT)
  const dirs = entries.filter(
    (entry) => entry.isDirectory && !entry.name.startsWith('.'),
  )
  return await Promise.all(
    dirs.map(async (entry) => ({
      name: entry.name,
      path: await toAbsoluteRootPath(entry.name),
    })),
  )
}

/**
 * Checks whether the one-time pin migration prompt is still owed to
 * this install. Returns the candidate subdirectories to offer if so, or
 * `null` if the prompt has already been answered or there's nothing to
 * migrate.
 *
 * A candidate list of zero subdirectories auto-resolves as answered — the
 * persisted flag is set without ever showing a prompt, since a brand-new
 * install with no pre-existing `nemos-app` folders has nothing meaningful
 * to ask about. A scan failure propagates instead of being treated as "no
 * candidates" — the persisted flag is only ever set on a completed scan, so
 * a transient error (e.g. a permission issue) is retried on next launch
 * rather than permanently forfeiting the migration.
 */
export const checkPinsMigration = async (): Promise<WorkspacePin[] | null> => {
  const prompted = await store.get<boolean>(PROMPTED_KEY)
  if (prompted) return null

  const candidates = await getMigrationCandidates()
  if (candidates.length === 0) {
    await setPinsMigrationPrompted()
    return null
  }

  return candidates
}

/**
 * Accepts the migration: pins every candidate subdirectory (name = folder
 * basename) and marks the prompt answered so it never reappears. A
 * candidate that's already pinned (e.g. manually added before this ran) is
 * skipped rather than failing the whole batch.
 */
export const acceptPinsMigration = async (candidates: WorkspacePin[]) => {
  // Guards against running before the registry's own init() has loaded
  // already-persisted pins (init() is a no-op once that's happened) — pin()
  // persists by overwriting the store with the full in-memory list, so
  // mutating from an uninitialized empty list would clobber them.
  await useWorkspaceRegistry.getState().init()
  const { pin } = useWorkspaceRegistry.getState()

  for (const candidate of candidates) {
    try {
      await pin(candidate.path, candidate.name)
    } catch (error) {
      if (
        !(error instanceof WorkspaceError && error.code === 'ALREADY_PINNED')
      ) {
        throw error
      }
    }
  }

  await setPinsMigrationPrompted()
}

/**
 * Declines the migration: marks the prompt answered, permanently, with
 * nothing pinned. The only sanctioned recovery path afterward is a manual
 * pin via Open Folder — there is no migration-specific re-prompt.
 */
export const declinePinsMigration = async () => {
  await setPinsMigrationPrompted()
}
