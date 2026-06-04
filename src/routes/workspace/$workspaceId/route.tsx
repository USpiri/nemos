import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { SidebarPanel } from '@/components/layout/SidebarPanel'
import { Topbar } from '@/components/layout/Topbar'
import { MigrationOverlay } from '@/components/MigrationOverlay'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTabShortcuts } from '@/hooks/use-tab-shortcuts'
import { findLegacyNotes } from '@/lib/migration'
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
    const legacyPaths = await findLegacyNotes(workspaceId)
    return { workspaceTree, legacyCount: legacyPaths.length }
  },
})

function RouteComponent() {
  useTabShortcuts()

  const { workspaceId } = Route.useParams()
  const { legacyCount } = Route.useLoaderData()

  return (
    <SidebarPanel>
      <MigrationOverlay workspaceId={workspaceId} legacyCount={legacyCount} />
      <div className="grid h-screen w-full grid-rows-[auto_1fr] overflow-hidden">
        <Topbar />
        <ScrollArea className="h-full overflow-hidden">
          <Outlet />
        </ScrollArea>
      </div>
    </SidebarPanel>
  )
}
