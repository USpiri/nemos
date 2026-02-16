import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { toast } from 'sonner'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebar } from '@/components/ui/sidebar'
import { useTabShortcuts } from '@/hooks/use-tab-shortcuts'
import { cn } from '@/lib/utils'
import { getWorkspaceTree } from '@/lib/workspace'

export const Route = createFileRoute('/workspace/$workspaceId')({
  component: RouteComponent,
  loader: async ({ params: { workspaceId } }) => {
    const workspaceTree = await getWorkspaceTree(workspaceId).catch(() => {
      toast.error('Workspace not found', {
        description: 'The workspace you are looking for does not exist.',
      })
      throw redirect({ to: '/workspace', replace: true })
    })
    return workspaceTree
  },
})

function RouteComponent() {
  const { open, setOpen, isMobile } = useSidebar()
  const sidebarRef = useRef<ImperativePanelHandle>(null)
  useTabShortcuts()

  useEffect(() => {
    const panel = sidebarRef.current
    if (!panel) return
    if (open) panel.expand()
    else panel.collapse()
  }, [open])

  return (
    <>
      <ResizablePanelGroup direction="horizontal" autoSaveId="sidebar-layout">
        <ResizablePanel
          collapsible
          collapsedSize={0}
          ref={sidebarRef}
          defaultSize={25}
          minSize={25}
          maxSize={40}
          onCollapse={() => setOpen(false)}
          onExpand={() => setOpen(true)}
          className={cn(isMobile && 'hidden')}
        >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle={open && !isMobile} />
        <ResizablePanel>
          <div className="grid h-screen w-full grid-rows-[auto_1fr] overflow-hidden">
            <Topbar />
            <ScrollArea className="h-full overflow-hidden">
              <Outlet />
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
