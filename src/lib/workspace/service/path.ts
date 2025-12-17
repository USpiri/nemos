import { ROOT } from "@/lib/constants";

export const getWorkspacePath = (workspace: string, root = ROOT) => {
  return `${root}/${workspace}`;
};
