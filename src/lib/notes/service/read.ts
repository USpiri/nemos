import { readJson } from "@/lib/fs";
import { Note, NoteSchema } from "@/lib/notes";

const root = "nemos-app";

export const readNote = async (path: string) => {
  const note = await readJson<Note>(`${root}/${path}`);
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new Error("Invalid note");
  }

  return parsed.data;
};
