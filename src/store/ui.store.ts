import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  setSidebarState: (open: boolean) => void
  sidebarWidth: number
  setSidebarWidth: (width: number) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      setSidebarState: (open) => set({ sidebarOpen: open }),
      sidebarWidth: 240,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
    }),
    {
      name: 'ui',
    },
  ),
)
