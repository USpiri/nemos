import { documentDir, join } from '@tauri-apps/api/path'
import { openPath as openPathFn } from '@tauri-apps/plugin-opener'

export const openPath = async (path: string): Promise<void> => {
  const parts = [await documentDir(), path]
  const fullPath = await join(...parts)
  await openPathFn(fullPath)
}
