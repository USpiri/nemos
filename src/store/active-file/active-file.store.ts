import { create } from "zustand";

interface Note {
  path: string;
  content: string;
}

interface State {
  activeFile: Note | null;
  setActiveFile: (note: Note) => void;
}

export const useActiveFileStore = create<State>()((set) => ({
  activeFile: null,
  setActiveFile: async (note) => {
    set({ activeFile: note });
  },
}));
