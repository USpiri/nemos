import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { RECENT_NOTES_LIMIT } from '@/config/constants'
import { getWorkspaceSummary } from '@/lib/workspace'
import {
  RecentNotesEmpty,
  RecentNotesTable,
  WorkspaceActions,
  WorkspaceError,
  WorkspaceHeader,
  WorkspacePending,
} from './-components'

export const Route = createFileRoute('/workspace/$workspaceId/')({
  component: WorkspaceIdIndex,
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  loader: async ({ params: { workspaceId } }) =>
    await getWorkspaceSummary(workspaceId, RECENT_NOTES_LIMIT),
})

function WorkspaceIdIndex() {
  const { notes, count } = Route.useLoaderData()
  const { workspaceId } = Route.useParams()

  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 px-8 py-16">
      <WorkspaceHeader workspace={workspaceId} count={count} />
      <WorkspaceActions />
      <Separator />
      {notes.length ? (
        <RecentNotesTable notes={notes} workspaceId={workspaceId} />
      ) : (
        <RecentNotesEmpty />
      )}
    </main>
  )
}
