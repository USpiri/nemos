import { create } from 'zustand'

type RenameContext = string | null | undefined

interface RenameState {
  renamingPath: string | null
  renamingContext: RenameContext
  setRenamingPath: (path: string | null, context?: RenameContext) => void
  isRenaming: (path: string, context: RenameContext) => boolean
}

export const useRenameStore = create<RenameState>((set, get) => ({
  renamingPath: null,
  renamingContext: null,
  setRenamingPath: (path, context) =>
    set({ renamingPath: path, renamingContext: context ?? null }),
  isRenaming: (path, context) =>
    path === get().renamingPath &&
    (context === null ||
      context === undefined ||
      context === get().renamingContext),
}))
