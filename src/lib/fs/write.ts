import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

export const write = async (path: string, content: string) => {
  return writeTextFile(path, content, {
    baseDir: BaseDirectory.Document,
  });
};

export const writeJson = async (path: string, content: object) => {
  return write(path, JSON.stringify(content, null, 2));
};
