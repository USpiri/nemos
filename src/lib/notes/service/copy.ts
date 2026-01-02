import { getUniquePath, copy } from "@/lib/fs";
import { getNotePath } from "./path";
import { NoteError } from "../errors";

interface Props {
  workspace: string;
  path: string;
}

export const copyNote = async ({ workspace, path }: Props) => {
  if (!path) {
    throw new NoteError("COPY_FAILED", "Note path is required");
  }

  const notePath = getNotePath(`${workspace}/${path}`);

  try {
    const uniquePath = await getUniquePath(notePath);

    await copy(notePath, uniquePath);
    return uniquePath;
  } catch (error) {
    throw new NoteError("COPY_FAILED", `Failed to copy note: ${notePath}`);
  }
};
