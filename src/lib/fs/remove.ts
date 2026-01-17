import { BaseDirectory, remove as tauriRemove } from '@tauri-apps/plugin-fs'

export const removeFile = async (path: string) => {
  return tauriRemove(path, {
    baseDir: BaseDirectory.Document,
  })
}

export const removeDir = async (path: string) => {
  return tauriRemove(path, {
    baseDir: BaseDirectory.Document,
    recursive: true,
  })
}
