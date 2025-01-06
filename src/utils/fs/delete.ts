import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";

export const deleteFile = async (path: string) => {
  return await remove(path, { baseDir: BaseDirectory.Document });
};

export const deleteFolder = async (path: string) => {
  return await remove(path, {
    baseDir: BaseDirectory.Document,
    recursive: true,
  });
};
