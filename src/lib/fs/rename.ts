import { BaseDirectory, rename as tauriRename } from '@tauri-apps/plugin-fs'

export const rename = async (from: string, to: string) => {
  return tauriRename(from, to, {
    oldPathBaseDir: BaseDirectory.Document,
    newPathBaseDir: BaseDirectory.Document,
  })
}
