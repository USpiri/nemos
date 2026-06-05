import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  setSidebarState: (open: boolean) => void
  sidebarWidth: string
  setSidebarWidth: (width: string) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarState: (open) => set({ sidebarOpen: open }),
      sidebarWidth: '16rem',
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
    }),
    {
      name: 'ui',
    },
  ),
)
