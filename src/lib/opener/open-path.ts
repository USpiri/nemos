import { appDataDir, documentDir, join } from '@tauri-apps/api/path'
import { openPath as openPathFn } from '@tauri-apps/plugin-opener'

export const openPath = async (path: string): Promise<void> => {
  const fullPath = await join(await documentDir(), path)
  await openPathFn(fullPath)
}

export const openAppDataPath = async (path: string): Promise<void> => {
  const fullPath = await join(await appDataDir(), path)
  await openPathFn(fullPath)
}
