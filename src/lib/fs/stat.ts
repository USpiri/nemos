import { BaseDirectory, stat as tauriStat } from '@tauri-apps/plugin-fs'

export const stat = async (path: string) => {
  return tauriStat(path, {
    baseDir: BaseDirectory.Document,
  })
}
