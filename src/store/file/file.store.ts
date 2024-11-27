import { getExtension, readNote } from "@/utils/fs";
import { create } from "zustand";

interface Note {
  path: string;
  content: string;
}

interface State {
  activeFile: Note | null;
  setActiveFile: (path: string) => void;
}

export const useFileStore = create<State>()((set) => ({
  activeFile: null,
  setActiveFile: async (path) => {
    const extension = getExtension(path);
    if (extension !== ".note") return;
    const { content } = await readNote(path);
    set({ activeFile: { path, content } });
  },
}));
