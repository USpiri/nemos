import { createFileRoute } from '@tanstack/react-router'
import { FolderOpen, FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { H1, P } from '@/components/ui/typography'
import { useDialog } from '@/hooks/use-dialog'
import { useOpenFolder } from '@/hooks/use-open-folder'
import { useRecentRoots, useWorkspaceRegistry } from '@/lib/workspace'
import {
  RecentRootList,
  RecentRootsEmpty,
  WorkspaceEmpty,
  WorkspaceError,
  WorkspaceList,
  WorkspacePending,
} from './-components'

type ListView = 'workspaces' | 'recent'

export const Route = createFileRoute('/workspace/')({
  // Only Recent Roots needs an explicit init here — the pin registry is
  // already initialized by the root route's loader (`getWorkspaces`).
  loader: () => useRecentRoots.getState().init(),
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  component: WorkspaceIndex,
})

function WorkspaceIndex() {
  const [view, setView] = useState<ListView>('workspaces')
  const workspaces = useWorkspaceRegistry((state) => state.workspaces)
  const recents = useRecentRoots((state) => state.recents)
  const { open } = useDialog()
  const { openFolder } = useOpenFolder()

  return (
    <div className="mx-auto grid h-screen w-full max-w-4xl grid-rows-[auto_auto_1fr] gap-6 overflow-hidden px-10 py-16">
      <header className="max-w-2xl space-y-6">
        <H1 size="sm">Get started</H1>
        <P variant="muted" size="sm" className="text-balance">
          Pick a Workspace you've pinned for quick access, reopen a recent
          folder, or add one below to get started.
        </P>
      </header>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div
          data-slot="button-group"
          role="tablist"
          aria-label="Workspace list view"
          className="inline-flex w-fit gap-1 rounded-lg border border-border bg-background p-1"
        >
          <Button
            type="button"
            role="tab"
            aria-selected={view === 'workspaces'}
            variant={view === 'workspaces' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('workspaces')}
          >
            Workspaces
          </Button>
          <Button
            type="button"
            role="tab"
            aria-selected={view === 'recent'}
            variant={view === 'recent' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('recent')}
          >
            Recent
          </Button>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <Button variant="outline" onClick={() => open('add-workspace')}>
            <FolderPlus /> Add Workspace
          </Button>
          <Button variant="outline" onClick={openFolder}>
            <FolderOpen /> Open Folder
          </Button>
        </div>
      </div>

      <ScrollArea className="h-full overflow-hidden">
        <section className="rounded-lg border">
          {view === 'workspaces' ? (
            workspaces.length ? (
              <WorkspaceList workspaces={workspaces} />
            ) : (
              <WorkspaceEmpty />
            )
          ) : recents.length ? (
            <RecentRootList recents={recents} />
          ) : (
            <RecentRootsEmpty />
          )}
        </section>
      </ScrollArea>
    </div>
  )
}
