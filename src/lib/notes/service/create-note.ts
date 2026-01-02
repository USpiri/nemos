import { getUniquePath, write } from "@/lib/fs";
import { Note } from "../note.type";
import { getNotePath } from "./path";
import { NoteError } from "../errors";

interface Props {
  workspace: string;
  path: string;
  content?: string;
}

export const createNote = async ({ workspace, path, content }: Props) => {
  const notePath = getNotePath(`${workspace}/${path}`);

  try {
    const uniquePath = await getUniquePath(notePath);
    const note: Note = {
      content: content || "",
    };

    await write(uniquePath, JSON.stringify(note, null, 2));
    return uniquePath;
  } catch (error) {
    throw new NoteError(
      "CREATE_FAILED",
      `Failed to create note: ${notePath}\n` +
        `Cause: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
