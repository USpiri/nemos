import { createDir, exists } from "../fs";
import { ROOT } from "@/config/constants";

export const ensureRoot = async () => {
  const check = await exists(ROOT);
  if (!check) return await createDir(ROOT);
};
