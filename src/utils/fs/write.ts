import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

export const write = async (path: string | URL, content: object) => {
  return await writeTextFile(path, JSON.stringify(content), {
    baseDir: BaseDirectory.Document,
  });
};
