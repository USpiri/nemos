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

  const file = `${path}/${fileName}${count ? `-${count}` : ""}.note`;

  await create(file, {
    baseDir: BaseDirectory.Document,
  });

  return {
    path: file,
  };
};
