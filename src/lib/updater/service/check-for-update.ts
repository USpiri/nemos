import { check } from '@tauri-apps/plugin-updater'
import { UpdaterError } from '../errors'
import type { UpdateInfo } from '../updater.type'

/**
 * Checks if there is an update available for the application
 * @returns UpdateInfo if an update is available, null otherwise
 * @throws UpdaterError with code CHECK_FAILED if the check fails
 */
export const checkForUpdate = async (): Promise<UpdateInfo | null> => {
  try {
    const update = await check()

    if (!update) return null

    return {
      updater: update,
      version: update.version,
      currentVersion: update.currentVersion,
      date: update.date,
      body: update.body,
    }
  } catch (error) {
    throw new UpdaterError(
      'CHECK_FAILED',
      `Failed to check for updates\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
