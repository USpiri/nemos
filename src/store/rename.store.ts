import { create } from "zustand";

interface RenameState {
  renamingPath: string | null;
  setRenamingPath: (path: string | null) => void;
  isRenaming: (path: string) => boolean;
}

export const useRenameStore = create<RenameState>((set, get) => ({
  renamingPath: null,
  setRenamingPath: (path) => set({ renamingPath: path }),
  isRenaming: (path) => path === get().renamingPath,
}));
