import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { RECENT_NOTES_LIMIT } from '@/config/constants'
import { rootFolderName } from '@/lib/paths'
import { getWorkspaceSummary } from '@/lib/workspace'
import {
  RecentNotesEmpty,
  RecentNotesTable,
  WorkspaceActions,
  WorkspaceError,
  WorkspaceHeader,
  WorkspacePending,
} from './-components'

export const Route = createFileRoute('/workspace/$rootPath/')({
  component: WorkspaceIdIndex,
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  loader: async ({ params: { rootPath } }) => {
    const folderName = rootFolderName(rootPath)
    return {
      ...(await getWorkspaceSummary(folderName, RECENT_NOTES_LIMIT)),
      folderName,
    }
  },
})

function WorkspaceIdIndex() {
  const { notes, count, folderName } = Route.useLoaderData()
  const { rootPath } = Route.useParams()

  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 px-8 py-16">
      <WorkspaceHeader workspace={folderName} count={count} />
      <WorkspaceActions />
      <Separator />
      {notes.length ? (
        <RecentNotesTable notes={notes} rootPath={rootPath} />
      ) : (
        <RecentNotesEmpty />
      )}
    </main>
  )
}
