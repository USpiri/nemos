import { ROOT } from "@/config/constants";

export const getNotePath = (path: string, root = ROOT) => {
  return `${root}/${path}`;
};
