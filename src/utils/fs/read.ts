import { Note } from "@/models/note.interface";
import {
  BaseDirectory,
  readDir as readDirectory,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { v4 as uuid } from "uuid";

export const readDir = async (path: string | URL) => {
  return await readDirectory(`${path}/`, {
    baseDir: BaseDirectory.Document,
  });
};

export const readDirRecursively = async (path: string, parentId?: string) => {
  const entries = (await readDir(path)).map((e) => ({
    ...e,
    path,
    id: uuid(),
    parentId: parentId ?? path,
  }));
  const results = [...entries];

  for (const entry of entries) {
    if (entry.isDirectory) {
      results.push(
        ...(await readDirRecursively(`${path}/${entry.name}`, entry.id)),
      );
    }
  }
  return results;
};

export const readFile = async (path: string | URL) => {
  return await readTextFile(path, {
    baseDir: BaseDirectory.Document,
  });
};

export const readNote = (path: string | URL) =>
  readFile(path)
    .then((raw) => (raw.length > 0 ? raw : '{"content":""}'))
    .then((data) => JSON.parse(data) as Note);
