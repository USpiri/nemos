import { Note, NoteSchema } from "@/lib/notes";
import { writeJson } from "@/lib/fs";

export const writeNote = async (path: string, note: Note) => {
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new Error("Invalid note");
  }

  await writeJson(path, parsed.data);
};
