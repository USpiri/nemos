import { readDirRecursive } from "@/lib/fs";
import { mapWorkspaceTree } from "../utils";

const root = "nemos-app";

export const getWorkspaceTree = async (workspace: string) => {
  const tree = await readDirRecursive(`${root}/${workspace}`);
  return mapWorkspaceTree(tree);
};
