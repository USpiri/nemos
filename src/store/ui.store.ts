import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  setSidebarState: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      setSidebarState: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui',
    },
  ),
)
