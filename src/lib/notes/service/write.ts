import { Note, NoteError, NoteSchema } from "@/lib/notes";
import { writeJson } from "@/lib/fs";
import { getNotePath } from "./path";

export const writeNote = async (path: string, note: Note) => {
  const parsed = NoteSchema.safeParse(note);

  if (!parsed.success) {
    throw new NoteError(
      "INVALID_CONTENT",
      parsed.error.issues.map((e) => e.message).join(", "),
    );
  }

  await writeJson(getNotePath(path), parsed.data);
};
