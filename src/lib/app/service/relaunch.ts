import { relaunch as tauriRelaunch } from '@tauri-apps/plugin-process'
import { AppError } from '../errors'

export const relaunch = async () => {
  try {
    await tauriRelaunch()
  } catch (error) {
    throw new AppError(
      'RELAUNCH_FAILED',
      `Failed to relaunch application after update\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
