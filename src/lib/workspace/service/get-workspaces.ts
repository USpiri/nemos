import { ROOT } from "@/config/constants";
import { readDir } from "@/lib/fs";

export const getWorkspaces = async () => {
  const workspaces = await readDir(ROOT);
  return workspaces;
};
