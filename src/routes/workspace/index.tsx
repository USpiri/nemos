import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FolderOpen, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { H1, P } from '@/components/ui/typography'
import { useDialog } from '@/hooks/use-dialog'
import { useOpenFolder } from '@/hooks/use-open-folder'
import { getWorkspaces, useWorkspaceRegistry } from '@/lib/workspace'
import {
  WorkspaceEmpty,
  WorkspaceError,
  WorkspaceList,
  WorkspacePending,
} from './-components'

export const Route = createFileRoute('/workspace/')({
  loader: () => getWorkspaces(),
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  component: WorkspaceIndex,
})

function WorkspaceIndex() {
  const workspaces = useWorkspaceRegistry((state) => state.workspaces)
  const router = useRouter()
  const { open } = useDialog()
  const { openFolder } = useOpenFolder()

  const handleRefresh = () => {
    void router.invalidate()
  }

  const length = workspaces.length

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-10 py-32">
      <header className="max-w-2xl space-y-6">
        <H1 size="sm">Your workspaces</H1>
        <P variant="muted" size="sm">
          Workspaces are folders you've pinned for quick access, wherever
          they live on disk. Pick one to continue, or add a folder to get
          started.
        </P>
      </header>

      <section className="flex-1">
        {length ? (
          <WorkspaceList workspaces={workspaces} />
        ) : (
          <WorkspaceEmpty onRefresh={handleRefresh} />
        )}
      </section>

      <div className="flex flex-row flex-wrap gap-2">
        <Button variant="outline" onClick={() => open('add-workspace')}>
          <FolderPlus /> Add Workspace
        </Button>
        <Button variant="outline" onClick={openFolder}>
          <FolderOpen /> Open Folder
        </Button>
      </div>
    </div>
  )
}
