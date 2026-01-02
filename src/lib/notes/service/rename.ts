import { exists, rename } from "@/lib/fs";
import { getFolderParentPath, getNoteFolderPath, getNotePath } from "./path";
import { NoteError } from "../errors";
import { FILE_EXTENSION } from "@/config/constants";

interface RenameNoteProps {
  workspace: string;
  note: string; // current note path
  newName: string; // new note name, without file extension and workspace path
}

export const renameNote = async ({
  workspace,
  note,
  newName,
}: RenameNoteProps) => {
  const fromPath = getNotePath(`${workspace}/${note}`);
  const parentDir = getNoteFolderPath(fromPath);
  const newPath = `${parentDir}/${newName}${FILE_EXTENSION}`;

  try {
    const existsTo = await exists(newPath);
    if (existsTo)
      throw new NoteError("RENAME_FAILED", `Note already exists: ${newPath}`);

    const existsFrom = await exists(fromPath);
    if (!existsFrom)
      throw new NoteError("NOT_FOUND", `Note not found: ${fromPath}`);

    await rename(fromPath, newPath);
    return newPath;
  } catch (error) {
    throw new NoteError(
      "RENAME_FAILED",
      `Failed to rename note: ${fromPath}\n` +
        `Cause: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

interface RenameFolderProps {
  workspace: string;
  folder: string; // current folder path
  newName: string; // new folder name, without file extension and workspace path
}

export const renameFolder = async ({
  workspace,
  folder,
  newName,
}: RenameFolderProps) => {
  const folderPath = getNotePath(`${workspace}/${folder}`);
  const parentDir = getFolderParentPath(folderPath);
  const newPath = `${parentDir}/${newName}`;

  try {
    const existsTo = await exists(newPath);
    if (existsTo)
      throw new NoteError("RENAME_FAILED", `Folder already exists: ${newPath}`);

    const existsFrom = await exists(folderPath);
    if (!existsFrom)
      throw new NoteError("NOT_FOUND", `Folder not found: ${folderPath}`);

    await rename(folderPath, newPath);
    return newPath;
  } catch (error) {
    throw new NoteError(
      "RENAME_FAILED",
      `Failed to rename folder: ${folderPath}\n` +
        `Cause: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
