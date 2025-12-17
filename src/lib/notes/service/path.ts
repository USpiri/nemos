import { ROOT } from "@/lib/constants";

export const getNotePath = (path: string, root = ROOT) => {
  return `${root}/${path}`;
};
