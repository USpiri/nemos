import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tab } from '@/lib/tabs'

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}

interface TabsActions {
  // Core
  openTab: (tab: Tab) => Tab
  closeTab: (tabId: string) => void
  activateTab: (tabId: string) => void

  // Bulk
  closeAllTabs: () => void
  closeOtherTabs: (tabId: string) => void
  closeTabsToRight: (tabId: string) => void
  closeTabsToLeft: (tabId: string) => void

  // Navigation
  activateNextTab: () => void
  activatePreviousTab: () => void
  activateTabByIndex: (index: number) => void

  // Reordering
  reorderTabs: (fromIndex: number, toIndex: number) => void

  // Queries
  findTab: (type: string, path: string) => Tab | undefined
  getActiveTab: () => Tab | undefined

  // State updates
  setTabDirty: (tabId: string, dirty: boolean) => void
  updateTabPayload: <T>(tabId: string, payload: T) => void
  updateTabTitle: (tabId: string, title: string) => void
}

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      // State
      tabs: [],
      activeTabId: null,

      // Core actions
      openTab: (tabData) => {
        const state = get()
        const existing = state.tabs.find((t) => t.id === tabData.id)

        if (existing) {
          get().activateTab(existing.id)
          return existing
        }

        set({
          tabs: [...state.tabs, tabData],
          activeTabId: tabData.id,
        })
        return tabData
      },

      closeTab: (tabId) => {
        const state = get()
        const tabIndex = state.tabs.findIndex((t) => t.id === tabId)
        if (tabIndex === -1) return

        const newTabs = state.tabs.filter((t) => t.id !== tabId)

        // Determine new active tab if closing the active one
        let newActiveTabId = state.activeTabId
        if (state.activeTabId === tabId) {
          if (newTabs.length === 0) {
            newActiveTabId = null
          } else if (tabIndex >= newTabs.length) {
            // Was last tab, activate the new last
            newActiveTabId = newTabs[newTabs.length - 1].id
          } else {
            // Activate the tab that took its place
            newActiveTabId = newTabs[tabIndex].id
          }
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveTabId,
        })
      },

      activateTab: (tabId) => {
        const state = get()
        const tab = state.tabs.find((t) => t.id === tabId)
        if (!tab) return

        set({ activeTabId: tabId })
      },

      // Bulk operations
      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null })
      },

      closeOtherTabs: (tabId) => {
        const state = get()
        const tabToKeep = state.tabs.find((t) => t.id === tabId)
        if (!tabToKeep) return

        set({
          tabs: [tabToKeep],
          activeTabId: tabId,
        })
      },

      closeTabsToRight: (tabId) => {
        const state = get()
        const tabIndex = state.tabs.findIndex((t) => t.id === tabId)
        if (tabIndex === -1) return

        const newTabs = state.tabs.slice(0, tabIndex + 1)

        set({
          tabs: newTabs,
          activeTabId: newTabs.some((t) => t.id === state.activeTabId)
            ? state.activeTabId
            : tabId,
        })
      },

      closeTabsToLeft: (tabId) => {
        const state = get()
        const tabIndex = state.tabs.findIndex((t) => t.id === tabId)
        if (tabIndex === -1) return

        const newTabs = state.tabs.slice(tabIndex)

        set({
          tabs: newTabs,
          activeTabId: newTabs.some((t) => t.id === state.activeTabId)
            ? state.activeTabId
            : tabId,
        })
      },

      // Navigation
      activateNextTab: () => {
        const state = get()
        if (!state.activeTabId || state.tabs.length <= 1) return

        const currentIndex = state.tabs.findIndex(
          (t) => t.id === state.activeTabId,
        )
        const nextIndex = (currentIndex + 1) % state.tabs.length
        get().activateTab(state.tabs[nextIndex].id)
      },

      activatePreviousTab: () => {
        const state = get()
        if (!state.activeTabId || state.tabs.length <= 1) return

        const currentIndex = state.tabs.findIndex(
          (t) => t.id === state.activeTabId,
        )
        const prevIndex =
          currentIndex === 0 ? state.tabs.length - 1 : currentIndex - 1
        get().activateTab(state.tabs[prevIndex].id)
      },

      activateTabByIndex: (index) => {
        const state = get()
        if (index >= 0 && index < state.tabs.length) {
          get().activateTab(state.tabs[index].id)
        }
      },

      // Reordering
      reorderTabs: (fromIndex, toIndex) => {
        const state = get()
        if (
          fromIndex < 0 ||
          fromIndex >= state.tabs.length ||
          toIndex < 0 ||
          toIndex >= state.tabs.length
        ) {
          return
        }

        const newTabs = [...state.tabs]
        const [moved] = newTabs.splice(fromIndex, 1)
        newTabs.splice(toIndex, 0, moved)

        set({ tabs: newTabs })
      },

      // Queries
      findTab: (type, path) => {
        const state = get()
        return state.tabs.find((t) => t.type === type && t.path === path)
      },

      getActiveTab: () => {
        const state = get()
        return state.tabs.find((t) => t.id === state.activeTabId)
      },

      // State updates
      setTabDirty: (tabId, dirty) => {
        const state = get()
        set({
          tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, dirty } : t)),
        })
      },

      updateTabPayload: <T>(tabId: string, payload: T) => {
        const state = get()
        set({
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, payload: { ...t.payload, ...payload } }
              : t,
          ) as Tab[],
        })
      },

      updateTabTitle: (tabId, title) => {
        const state = get()
        set({
          tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, title } : t)),
        })
      },
    }),
    {
      name: 'nemos-tabs',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    },
  ),
)
