import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { RECENT_NOTES_LIMIT } from '@/config/constants'
import { rootFolderName } from '@/lib/paths'
import { getRootSummary } from '@/lib/workspace'
import {
  RecentNotesEmpty,
  RecentNotesTable,
  RootActions,
  RootError,
  RootHeader,
  RootPending,
} from './-components'

export const Route = createFileRoute('/workspace/$rootPath/')({
  component: RootIndex,
  pendingComponent: RootPending,
  errorComponent: RootError,
  loader: async ({ params: { rootPath } }) => {
    return getRootSummary(rootPath, RECENT_NOTES_LIMIT)
  },
})

function RootIndex() {
  const { notes, count } = Route.useLoaderData()
  const { rootPath } = Route.useParams()

  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 px-8 py-16">
      <RootHeader rootName={rootFolderName(rootPath)} count={count} />
      <RootActions rootPath={rootPath} />
      <Separator />
      {notes.length ? (
        <RecentNotesTable notes={notes} rootPath={rootPath} />
      ) : (
        <RecentNotesEmpty />
      )}
    </main>
  )
}
