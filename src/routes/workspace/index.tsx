import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Code, H1, P } from '@/components/ui/typography'
import { ROOT } from '@/config/constants'
import { useDialog } from '@/hooks/use-dialog'
import { getWorkspaces } from '@/lib/workspace'
import {
  WorkspaceEmpty,
  WorkspaceError,
  WorkspaceList,
  WorkspacePending,
} from './-components'

export const Route = createFileRoute('/workspace/')({
  loader: async () => {
    const workspaces = await getWorkspaces()
    return { workspaces }
  },
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  component: WorkspaceIndex,
})

function WorkspaceIndex() {
  const { workspaces } = Route.useLoaderData()
  const router = useRouter()
  const { open } = useDialog()

  const handleRefresh = () => {
    void router.invalidate()
  }

  const length = workspaces.length

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-10 py-32">
      <header className="max-w-2xl space-y-6">
        <H1 size="sm">Your workspaces</H1>
        <P variant="muted" size="sm">
          Each workspace is a folder you manage inside <Code>{ROOT}</Code>. Pick
          one to continue or create a new folder to start fresh.
        </P>
      </header>

      <section className="flex-1">
        {length ? (
          <WorkspaceList workspaces={workspaces} />
        ) : (
          <WorkspaceEmpty onRefresh={handleRefresh} />
        )}
      </section>

      <Button variant="outline" onClick={() => open('workspace')}>
        <FolderPlus /> Create a new workspace
      </Button>
    </div>
  )
}
