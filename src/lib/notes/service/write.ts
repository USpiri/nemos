import { Note, NoteSchema } from "@/lib/notes";
import { writeJson } from "@/lib/fs";
import { getNotePath } from "./path";

export const writeNote = async (path: string, note: Note) => {
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new Error("Invalid note");
  }

  await writeJson(getNotePath(path), parsed.data);
};
