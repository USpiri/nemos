import { BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { readDir } from "./read";

export const getExtension = (str: string) => str.slice(str.lastIndexOf("."));

export const getFilename = (str: string) => str.slice(str.lastIndexOf("/") + 1);

export const getTreeNodeFiles = async (path: string) => {
  return await readDir(path).then((data) =>
    data.map((item) => ({
      id: `${path}/${item.name}`,
      parent: path,
      droppable: item.isDirectory,
      text: item.name!,
      data: item,
    })),
  );
};

export const generateUniqueName = async (
  path: string | URL,
  baseName: string,
  extension = "",
) => {
  let count = 0;
  let fullPath;

  do {
    const suffix = count ? `-${count}` : "";
    fullPath = `${path}/${baseName}${suffix}${extension}`;
    count++;
  } while (await exists(fullPath, { baseDir: BaseDirectory.Document }));

  return fullPath;
};
