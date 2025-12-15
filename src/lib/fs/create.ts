import {
  BaseDirectory,
  create as tauriCreate,
  mkdir,
} from "@tauri-apps/plugin-fs";

export const createFile = async (path: string) => {
  return tauriCreate(path, {
    baseDir: BaseDirectory.Document,
  });
};

export const createDir = async (path: string) => {
  return mkdir(path, {
    baseDir: BaseDirectory.Document,
  });
};
