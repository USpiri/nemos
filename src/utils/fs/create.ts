import { ROOT_FOLDER } from "@/config/constants";
import { Note } from "@/models/note.interface";
import { BaseDirectory, create, mkdir } from "@tauri-apps/plugin-fs";
import { generateUniqueName } from "./utils";
import { write } from "./write";

interface CreateNoteOptions {
  filename?: string;
  note?: Note;
}

export const createNote = async (
  path = ROOT_FOLDER,
  opts?: CreateNoteOptions,
) => {
  const file = await generateUniqueName(
    path,
    opts?.filename ?? "new-note",
    ".note",
  );

  await create(file, { baseDir: BaseDirectory.Document });
  if (opts?.note) {
    await write(file, opts.note);
  }

  return {
    path: file,
    name: file.split("/").pop()!,
  };
};

interface CreateDirOptions {
  name?: string;
}

export const createDir = async (
  path = ROOT_FOLDER,
  opts?: CreateDirOptions,
) => {
  const dir = await generateUniqueName(path, opts?.name ?? "new-folder");
  await mkdir(dir, { baseDir: BaseDirectory.Document });

  return {
    path: dir,
    name: dir.split("/").pop(),
  };
};
