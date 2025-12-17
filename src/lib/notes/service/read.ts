import { readJson } from "@/lib/fs";
import { Note, NoteSchema } from "@/lib/notes";
import { getNotePath } from "./path";

export const readNote = async (path: string) => {
  const note = await readJson<Note>(getNotePath(path));
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new Error("Invalid note");
  }

  return parsed.data;
};
