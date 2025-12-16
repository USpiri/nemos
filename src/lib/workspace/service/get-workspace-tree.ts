import { readDirRecursive } from "@/lib/fs";
import { mapWorkspaceTree } from "../utils";
import { ROOT } from "@/lib/constants";

export const getWorkspaceTree = async (workspace: string) => {
  const tree = await readDirRecursive(`${ROOT}/${workspace}`);
  return mapWorkspaceTree(tree);
};
