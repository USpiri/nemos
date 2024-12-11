import { BaseDirectory, create, mkdir } from "@tauri-apps/plugin-fs";
import { generateUniqueName } from "./utils";

export const createNote = async (path: string | URL) => {
  const file = await generateUniqueName(path, "new-note", ".note");
  await create(file, { baseDir: BaseDirectory.Document });

  return {
    path: file,
    name: file.split("/").pop(),
  };
};

export const createDir = async (path: string | URL) => {
  const dir = await generateUniqueName(path, "new-folder");
  await mkdir(dir, { baseDir: BaseDirectory.Document });

  return {
    path: dir,
    name: dir.split("/").pop(),
  };
};
