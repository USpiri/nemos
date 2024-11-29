import { BaseDirectory, create, exists } from "@tauri-apps/plugin-fs";

export const createNote = async (path: string | URL) => {
  const fileName = "new-note";
  let count = 0;

  while (
    await exists(`${path}/${fileName}${count ? `-${count}` : ""}.note`, {
      baseDir: BaseDirectory.Document,
    })
  ) {
    count++;
  }

  const file = `${fileName}${count ? `-${count}` : ""}.note`;

  return await create(`${path}/${file}`, {
    baseDir: BaseDirectory.Document,
  });
};
