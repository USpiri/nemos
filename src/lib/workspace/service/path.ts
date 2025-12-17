import { ROOT } from "@/config/constants";

export const getWorkspacePath = (workspace: string, root = ROOT) => {
  return `${root}/${workspace}`;
};
