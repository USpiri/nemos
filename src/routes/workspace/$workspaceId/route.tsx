import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTabShortcuts } from '@/hooks/use-tab-shortcuts'
import { getWorkspaceTree } from '@/lib/workspace'

export const Route = createFileRoute('/workspace/$workspaceId')({
  component: RouteComponent,
  loader: async ({ params: { workspaceId } }) => {
    const workspaceTree = await getWorkspaceTree(workspaceId).catch(() => {
      throw redirect({ to: '/workspace', replace: true })
    })
    return workspaceTree
  },
})

function RouteComponent() {
  useTabShortcuts()

  return (
    <>
      <Sidebar />
      <div className="grid h-screen w-full grid-rows-[auto_1fr] overflow-hidden">
        <Topbar />
        <ScrollArea className="h-full overflow-hidden">
          <Outlet />
        </ScrollArea>
      </div>
    </>
  )
}
