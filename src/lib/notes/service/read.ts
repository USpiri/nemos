import { read } from "@/lib/fs";
import { emptyNote, NoteSchema } from "@/lib/notes";
import { getNotePath } from "./path";
import { NoteError } from "../errors";

const readRawNote = async (path: string) => {
  try {
    return await read(getNotePath(path));
  } catch (error) {
    throw new NoteError("NOT_FOUND", `Note not found: ${path}`);
  }
};

const parseNote = (raw: string) => {
  if (raw.trim().length === 0) return emptyNote;

  try {
    const parsed = NoteSchema.safeParse(JSON.parse(raw));

    if (!parsed.success)
      throw new NoteError(
        "INVALID_CONTENT",
        parsed.error.issues.map((e) => e.message).join(", "),
      );

    return parsed.data;
  } catch {
    throw new NoteError("INVALID_CONTENT", `Invalid note content: ${raw}`);
  }
};

export const readNote = async (path: string) => {
  const raw = await readRawNote(path);
  return parseNote(raw);
};
