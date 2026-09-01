import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import { Topbar } from '@/components/layout/Topbar'
import { MigrationOverlay } from '@/components/MigrationOverlay'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTabShortcuts } from '@/hooks/use-tab-shortcuts'
import { findLegacyNotes } from '@/lib/migration'
import { initRootSettings } from '@/lib/settings'
import {
  findPinnedWorkspace,
  getWorkspaceTree,
  useRecentRoots,
  useWorkspaceRegistry,
} from '@/lib/workspace'
import { useDialogStore } from '@/store'

export const Route = createFileRoute('/workspace/$rootPath')({
  component: RouteComponent,
  loader: async ({ params: { rootPath } }) => {
    const workspaceTree = await getWorkspaceTree(rootPath).catch(async () => {
      // A pinned Workspace gets a Relocate/Delete pin/Retry prompt (#90)
      // instead of the silent drop-with-toast below.
      const pin = findPinnedWorkspace(
        useWorkspaceRegistry.getState().workspaces,
        rootPath,
      )
      if (pin) {
        useDialogStore.getState().open('workspace-missing-path', { ...pin })
        throw redirect({ to: '/workspace', replace: true })
      }

      // The Root no longer exists at this path — drop any stale Recent
      // entry for it too (#88); no-op if it was never recorded there.
      await useRecentRoots.getState().remove(rootPath)
      toast.error('Root not found', {
        description: 'The folder you are looking for does not exist.',
      })
      throw redirect({ to: '/workspace', replace: true })
    })
    // Every successful Root open — pinned or not — bumps/upserts the
    // Recent Roots MRU list (#88).
    await useRecentRoots.getState().recordOpen(rootPath)
    const [legacyPaths] = await Promise.all([
      findLegacyNotes(rootPath),
      initRootSettings(rootPath),
    ])
    return { workspaceTree, legacyCount: legacyPaths.length }
  },
})

function RouteComponent() {
  useTabShortcuts()

  const { rootPath } = Route.useParams()
  const { legacyCount } = Route.useLoaderData()

  return (
    <SidebarProvider>
      <MigrationOverlay
        key={rootPath}
        rootPath={rootPath}
        legacyCount={legacyCount}
      />
      <Sidebar />
      <div className="content grid h-screen w-full grid-rows-[auto_1fr] overflow-hidden">
        <Topbar />
        <ScrollArea className="h-full overflow-hidden">
          <Outlet />
        </ScrollArea>
      </div>
    </SidebarProvider>
  )
}
