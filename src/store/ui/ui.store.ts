import { create } from "zustand";

interface State {
  isSidebarOpen: boolean;
  toggleSidebar: (open?: boolean) => void;
}

export const useUIStore = create<State>()((set) => ({
  isSidebarOpen: false,
  toggleSidebar: (open) =>
    set((state) => ({ isSidebarOpen: open ?? !state.isSidebarOpen })),
}));
