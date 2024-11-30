import { create } from "zustand";

interface State {
  isSidebarOpen: boolean;
  isConfigOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
  toggleConfig: (open?: boolean) => void;
}

export const useUIStore = create<State>()((set) => ({
  isSidebarOpen: false,
  isConfigOpen: false,
  toggleSidebar: (open) =>
    set((state) => ({ isSidebarOpen: open ?? !state.isSidebarOpen })),
  toggleConfig: (open) =>
    set((state) => ({ isConfigOpen: open ?? !state.isConfigOpen })),
}));
