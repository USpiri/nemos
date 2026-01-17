import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { buildNavigationFromTab } from '@/lib/tabs'
import { useTabsStore } from '@/store'

export const useTabShortcuts = () => {
  const navigate = useNavigate()
  const closeTab = useTabsStore((s) => s.closeTab)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const activateNextTab = useTabsStore((s) => s.activateNextTab)
  const activatePreviousTab = useTabsStore((s) => s.activatePreviousTab)
  const activateTabByIndex = useTabsStore((s) => s.activateTabByIndex)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      // Ctrl+W: Close current tab
      if (isCtrlOrCmd && e.key === 'w') {
        e.preventDefault()
        if (activeTabId) {
          closeTab(activeTabId)
          // Navigate to new active tab
          const activeTab = useTabsStore.getState().getActiveTab()
          if (activeTab) {
            navigate(buildNavigationFromTab(activeTab))
          }
        }
      }

      // Ctrl+Tab: Next tab
      if (e.ctrlKey && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        activateNextTab()
        const activeTab = useTabsStore.getState().getActiveTab()
        if (activeTab) {
          navigate(buildNavigationFromTab(activeTab))
        }
      }

      // Ctrl+Shift+Tab: Previous tab
      if (e.ctrlKey && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault()
        activatePreviousTab()
        const activeTab = useTabsStore.getState().getActiveTab()
        if (activeTab) {
          navigate(buildNavigationFromTab(activeTab))
        }
      }

      // Ctrl+1-9: Activate tab by index
      if (isCtrlOrCmd && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        activateTabByIndex(parseInt(e.key) - 1)
        const activeTab = useTabsStore.getState().getActiveTab()
        if (activeTab) {
          navigate(buildNavigationFromTab(activeTab))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    activeTabId,
    closeTab,
    activateNextTab,
    activatePreviousTab,
    activateTabByIndex,
    navigate,
  ])
}
