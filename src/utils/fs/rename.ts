import {
  BaseDirectory,
  exists,
  rename as tauriRename,
} from "@tauri-apps/plugin-fs";

const options = {
  newPathBaseDir: BaseDirectory.Document,
  oldPathBaseDir: BaseDirectory.Document,
};

export const move = async (from: string | URL, to: string | URL) => {
  try {
    if (to === from) return;
    if (await exists(to, { baseDir: BaseDirectory.Document }))
      throw "File already exists";

    return await tauriRename(from, to, options);
  } catch (e) {
    throw new Error(`Unable to rename file or directory: ${e}`);
  }
};
export const rename = move;
