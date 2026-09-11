import { appDataDir, join } from '@tauri-apps/api/path'
import {
  openPath as openPathFn,
  revealItemInDir,
} from '@tauri-apps/plugin-opener'

// `path` must already be OS-absolute (every Root path is, per #85 — a Root
// can live anywhere on disk, not just under Documents). `open_path` is
// gated by the static `opener:allow-open-path` capability scope, which —
// unlike the fs plugin — has no dynamic runtime counterpart a folder picker
// can extend, so it can never cover a Root outside `$DOCUMENT`/`$APPDATA`.
// `reveal_item_in_dir` has no scope check at all (already unrestricted via
// `opener:default`), so any Root-relative path goes through it instead.
export const revealPath = async (path: string): Promise<void> => {
  await revealItemInDir(path)
}

// Global (APPDATA) paths stay within the static opener:allow-open-path
// scope regardless of which Root is open, so open_path still works here.
export const openAppDataPath = async (path: string): Promise<void> => {
  const fullPath = await join(await appDataDir(), path)
  await openPathFn(fullPath)
}
