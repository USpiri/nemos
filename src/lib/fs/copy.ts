import { BaseDirectory, copyFile } from '@tauri-apps/plugin-fs'

export const copy = async (from: string, to: string) => {
  return copyFile(from, to, {
    fromPathBaseDir: BaseDirectory.Document,
    toPathBaseDir: BaseDirectory.Document,
  })
}
