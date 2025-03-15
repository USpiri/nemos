import { INDEX_FILE_CONTENT, ROOT_FOLDER } from "@/config/constants";
import { exists, mkdir, BaseDirectory, create } from "@tauri-apps/plugin-fs";
import { write } from "./fs";

type AfterInit = ({
  fileDir,
  check,
}: {
  fileDir: string;
  check: boolean;
}) => void;

export const initialize = async (afterInit?: AfterInit) => {
  const fileDir = `${ROOT_FOLDER}/index.note`;
  const check = await exists(`${ROOT_FOLDER}/`, {
    baseDir: BaseDirectory.Document,
  });
  if (!check) {
    await mkdir(`${ROOT_FOLDER}`, { baseDir: BaseDirectory.Document });
    await create(fileDir, { baseDir: BaseDirectory.Document });
    await write(fileDir, { content: INDEX_FILE_CONTENT });
  }
  afterInit?.({ fileDir, check });
};
