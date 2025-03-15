import { ROOT_FOLDER } from "@/config/constants";
import { exists, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";

export const initialize = async () => {
  const check = await exists(`${ROOT_FOLDER}/`, {
    baseDir: BaseDirectory.Document,
  });
  if (!check)
    await mkdir(`${ROOT_FOLDER}`, { baseDir: BaseDirectory.Document });
};
