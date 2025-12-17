import { readDirRecursive } from "@/lib/fs";
import { mapWorkspaceTree } from "../utils";
import { getWorkspacePath } from "./path";

export const getWorkspaceTree = async (workspace: string) => {
  const tree = await readDirRecursive(getWorkspacePath(workspace));
  return mapWorkspaceTree(tree);
};
