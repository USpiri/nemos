import { create } from "zustand";

interface State {
  isSidebarOpen: boolean;
  isConfigOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
  toggleConfig: (open?: boolean) => void;
}

const initialState = () => {
  const { isSidebarOpen = false } = JSON.parse(
    localStorage.getItem("UI") || "undefined",
  );
  return {
    isSidebarOpen,
    isConfigOpen: false,
  };
};

export const useUIStore = create<State>()((set, get) => ({
  ...initialState(),
  toggleSidebar: (open) => {
    const { isSidebarOpen } = get();
    const newState = open ?? !isSidebarOpen;
    localStorage.setItem("UI", JSON.stringify({ isSidebarOpen: newState }));
    set({ isSidebarOpen: newState });
  },
  toggleConfig: (open) =>
    set((state) => ({ isConfigOpen: open ?? !state.isConfigOpen })),
}));
