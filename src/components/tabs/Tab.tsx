import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useCallback } from 'react'
import type { Tab as TabType } from '@/lib/tabs'
import { cn } from '@/lib/utils'
import { useTabsStore } from '@/store'
import { TabContextMenu } from './TabContextMenu'

interface Props {
  tab: TabType
  isActive: boolean
}

export const Tab = ({ tab, isActive }: Props) => {
  const navigate = useNavigate()
  const activateTab = useTabsStore((s) => s.activateTab)
  const closeTab = useTabsStore((s) => s.closeTab)

  const handleClick = useCallback(() => {
    activateTab(tab.id)
    navigate({ to: tab.path })
  }, [activateTab, tab.id, tab.path, navigate])

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      closeTab(tab.id)
      // Navigate to the new active tab after closing
      const activeTab = useTabsStore.getState().getActiveTab()
      if (activeTab) {
        navigate({ to: activeTab.path })
      }
    },
    [closeTab, tab.id, navigate],
  )

  const handleMiddleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
        closeTab(tab.id)
        // Navigate to the new active tab after closing
        const activeTab = useTabsStore.getState().getActiveTab()
        if (activeTab) {
          navigate({ to: activeTab.path })
        }
      }
    },
    [closeTab, tab.id, navigate],
  )

  return (
    <TabContextMenu tab={tab}>
      <div
        role="tab"
        aria-selected={isActive}
        onClick={handleClick}
        onMouseDown={handleMiddleClick}
        className={cn(
          'group flex h-full min-w-[100px] max-w-[180px] cursor-pointer items-center gap-1.5 border-border border-r px-2',
          'transition-colors hover:bg-accent/50',
          isActive && 'bg-background',
        )}
      >
        <span
          className={cn(
            'flex-1 truncate text-sm',
            tab.dirty && 'italic',
            isActive ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {tab.dirty && <span className="mr-0.5">*</span>}
          {tab.title}
        </span>
        <button
          onClick={handleClose}
          className={cn(
            'shrink-0 rounded p-0.5',
            'opacity-0 hover:bg-accent group-hover:opacity-100',
            isActive && 'opacity-100',
          )}
        >
          <X className="size-3" />
        </button>
      </div>
    </TabContextMenu>
  )
}
