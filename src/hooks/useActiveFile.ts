import { useActiveFileStore } from "@/store/active-file/active-file.store";
import { getExtension, readNote } from "@/utils/fs";

export const useActiveFile = () => {
  const activeFile = useActiveFileStore((store) => store.setActiveFile);
  const path = useActiveFileStore((store) => store.activeFile?.path);
  const content = useActiveFileStore((store) => store.activeFile?.content);

  const loadActiveFile = async () => {
    const path = localStorage.getItem("active") ?? "";
    await setActiveFile(path);
  };

  const setActiveFile = async (path: string) => {
    const extension = getExtension(path);
    if (extension !== ".note") return;
    const { content } = await readNote(path);
    localStorage.setItem("active", path);

    activeFile({ content, path });
  };

  return {
    path,
    content,
    loadActiveFile,
    setActiveFile,
  };
};
