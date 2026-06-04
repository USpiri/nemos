import { usePanelRef } from 'react-resizable-panels'
import { Sidebar } from '@/components/layout/Sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface SidebarPanelProps {
  children: React.ReactNode
}

export const SidebarPanel = ({ children }: SidebarPanelProps) => {
  const { open, setOpen, isMobile } = useSidebar()
  const sidebarRef = usePanelRef()

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel
        collapsible
        collapsedSize={0}
        panelRef={sidebarRef}
        defaultSize="240px"
        minSize="200px"
        maxSize="400px"
        onResize={(nextSize, _id, prevSize) => {
          if (prevSize !== undefined) {
            const wasCollapsed = prevSize.asPercentage === 0
            const isCollapsed = nextSize.asPercentage === 0
            if (isCollapsed !== wasCollapsed) {
              setOpen(!isCollapsed)
            }
          }
        }}
        className={cn(isMobile && 'hidden')}
      >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle withHandle={open && !isMobile} />
      <ResizablePanel>{children}</ResizablePanel>
    </ResizablePanelGroup>
  )
}
