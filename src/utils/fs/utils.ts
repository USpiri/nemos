import { BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { readDirRecursively } from "./read";

export const getExtension = (str: string) => str.slice(str.lastIndexOf("."));

export const getFilename = (str: string) => str.slice(str.lastIndexOf("/") + 1);

export const splitFileName = (str: string) => ({
  file: str.substring(0, str.lastIndexOf(".")),
  extension: str.substring(str.lastIndexOf("."), str.length),
});

export const getTreeNodeFiles = async (path: string) => {
  return await readDirRecursively(path).then((data) =>
    data.map((item) => ({
      id: item.id,
      parent: item.parentId,
      droppable: item.isDirectory,
      text: item.name,
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
