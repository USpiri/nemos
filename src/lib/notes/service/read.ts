import { ROOT } from "@/lib/constants";
import { readJson } from "@/lib/fs";
import { Note, NoteSchema } from "@/lib/notes";

export const readNote = async (path: string) => {
  const note = await readJson<Note>(`${ROOT}/${path}`);
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new Error("Invalid note");
  }

  return parsed.data;
};
