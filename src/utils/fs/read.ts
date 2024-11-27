import { Note } from "@/models/note.interface";
import {
  BaseDirectory,
  readDir as readDirectory,
  readTextFile,
} from "@tauri-apps/plugin-fs";

export const readDir = async (path: string | URL) => {
  return await readDirectory(`${path}/`, {
    baseDir: BaseDirectory.Document,
  });
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
