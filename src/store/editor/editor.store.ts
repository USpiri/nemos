import { create } from "zustand";

interface State {
  readonly: boolean;
  setReadOnly: (state: boolean) => void;
}

export const useEditorStore = create<State>()((set) => ({
  readonly: false,
  setReadOnly: (state) => set({ readonly: state }),
}));
