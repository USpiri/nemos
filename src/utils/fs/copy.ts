import { BaseDirectory, copyFile } from "@tauri-apps/plugin-fs";
import { generateUniqueName, getFilename, splitFileName } from "./utils";

export const copy = async (path: string) => {
  const { file, extension } = splitFileName(getFilename(path));
  const filePath = path.substring(0, path.lastIndexOf("/"));
  const dir = await generateUniqueName(filePath, file, extension);

  await copyFile(path, dir, {
    fromPathBaseDir: BaseDirectory.Document,
    toPathBaseDir: BaseDirectory.Document,
  });

  return {
    path: dir,
    name: dir.split("/").pop(),
  };
};
