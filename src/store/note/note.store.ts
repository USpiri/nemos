import { Note } from "@/models/note.interface";
import { create } from "zustand";

interface State {
  note: Note | null;
  setNote: (note: Note) => void;
  updateContent: (content: string) => void;
  setReadOnly: (readonly: boolean) => void;
}

export const useNoteStore = create<State>()((set) => ({
  note: null,
  setNote: (note) => set({ note }),
  updateContent: (content) =>
    set((state) => ({
      note: state.note ? { ...state.note, content } : null,
    })),
  setReadOnly: (readonly) =>
    set((state) => ({
      note: state.note ? { ...state.note, readonly } : null,
    })),
}));
