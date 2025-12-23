import { ROOT } from "@/config/constants";
import { readDir } from "@/lib/fs";
import { getWorkspacePath } from "./path";
import { isValidWorkspaceDirectory } from "../utils";

export const getWorkspaces = async () => {
  const entries = await readDir(ROOT);
  const entriesWithPath = entries.map((entry) => ({
    ...entry,
    path: getWorkspacePath(entry.name),
  }));

  const workspaces = entriesWithPath.filter(isValidWorkspaceDirectory);

  return workspaces;
};
