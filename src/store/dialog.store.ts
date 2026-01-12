import { create } from "zustand";

export type DialogType = "workspace" | "update";

interface DialogState {
  dialog: DialogType | null;
  data: Record<string, unknown> | null;

  open: (dialog: DialogType, data?: Record<string, any>) => void;
  close: () => void;
  isOpen: (dialog: DialogType) => boolean;
  getData: () => Record<string, unknown> | null;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  dialog: null,
  data: null,
  open: (dialog, data) => set({ dialog, data }),
  close: () => set({ dialog: null, data: null }),
  isOpen: (dialog) => dialog === get().dialog,
  getData: () => get().data ?? null,
}));
