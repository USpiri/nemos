import { useNavigate } from '@tanstack/react-router'
import { ArrowLeftToLine, ArrowRightToLine, CopyX, X } from 'lucide-react'
import { useCallback } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { Tab } from '@/lib/tabs'
import { useTabsStore } from '@/store'

interface Props {
  tab: Tab
  children: React.ReactNode
}

export const TabContextMenu = ({ tab, children }: Props) => {
  const closeTab = useTabsStore((s) => s.closeTab)
  const closeOtherTabs = useTabsStore((s) => s.closeOtherTabs)
  const closeTabsToLeft = useTabsStore((s) => s.closeTabsToLeft)
  const closeTabsToRight = useTabsStore((s) => s.closeTabsToRight)
  const closeAllTabs = useTabsStore((s) => s.closeAllTabs)
  const tabs = useTabsStore((s) => s.tabs)
  const navigate = useNavigate()

  const tabIndex = tabs.findIndex((t) => t.id === tab.id)
  const hasTabsToLeft = tabIndex > 0
  const hasTabsToRight = tabIndex < tabs.length - 1
  const hasOtherTabs = tabs.length > 1

  const handleCloseAllTabs = useCallback(() => {
    closeAllTabs()
    navigate({
      to: '/workspace/$workspaceId',
      params: { workspaceId: tab.payload.workspaceId },
    })
  }, [closeAllTabs, navigate, tab.payload.workspaceId])

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 p-0">
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => closeTab(tab.id)}
        >
          <X className="text-foreground" />
          Close
        </ContextMenuItem>
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => closeOtherTabs(tab.id)}
          disabled={!hasOtherTabs}
        >
          <CopyX className="text-foreground" />
          Close Others
        </ContextMenuItem>
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => closeTabsToLeft(tab.id)}
          disabled={!hasTabsToLeft}
        >
          <ArrowLeftToLine className="text-foreground" />
          Close to the Left
        </ContextMenuItem>
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={() => closeTabsToRight(tab.id)}
          disabled={!hasTabsToRight}
        >
          <ArrowRightToLine className="text-foreground" />
          Close to the Right
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="rounded-none px-2 py-1.5 text-muted-foreground text-xs"
          onClick={handleCloseAllTabs}
          variant="destructive"
        >
          <X className="text-foreground" />
          Close All
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
