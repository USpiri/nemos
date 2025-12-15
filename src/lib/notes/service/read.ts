import { readJson } from "@/lib/fs";
import { Note } from "@/models/note.interface";

const root = "nemos-app";

export const readNote = async (path: string) => {
  const note = await readJson<Note>(`${root}/${path}`);
  return note;
};
