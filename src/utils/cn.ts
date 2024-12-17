import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// TODO:
// - Remove double export
export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(args));
};
export default cn;
