import {
  DEFAULT_FOLDER_NAME,
  DEFAULT_NOTE_NAME,
  FILE_EXTENSION,
  ROOT,
} from "@/config/constants";

export const getNotePath = (path: string, root = ROOT) => {
  return `${root}/${path}`;
};

export const getNoteFolderPath = (path: string) => {
  const isFolder = !path.endsWith(FILE_EXTENSION);
  return isFolder ? path : path.split("/").slice(0, -1).join("/");
};

export function getNewNotePath(parentPath?: string) {
  if (!parentPath) return DEFAULT_NOTE_NAME;
  if (parentPath.endsWith(FILE_EXTENSION)) {
    return getNoteFolderPath(parentPath) + "/" + DEFAULT_NOTE_NAME;
  }
  return `${parentPath}/${DEFAULT_NOTE_NAME}`;
}

export function getNewFolderPath(parentPath?: string) {
  if (!parentPath) return DEFAULT_FOLDER_NAME;

  // Parent is a file → use its folder
  if (parentPath.endsWith(FILE_EXTENSION)) {
    return `${getNoteFolderPath(parentPath)}/${DEFAULT_FOLDER_NAME}`;
  }

  // Parent is a folder
  return `${parentPath}/${DEFAULT_FOLDER_NAME}`;
}

export const getNoteIdFromPath = (path: string) =>
  path.split("/").slice(2).join("/");
