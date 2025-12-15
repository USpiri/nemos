import { BaseDirectory, exists as tauriExists } from "@tauri-apps/plugin-fs";

export const exists = async (path: string) => {
  return tauriExists(path, {
    baseDir: BaseDirectory.Document,
  });
};
