import { Separator } from "@/components/ui/separator";
import { getWorkspaceSummary } from "@/lib/workspace";
import { createFileRoute } from "@tanstack/react-router";
import {
  WorkspaceHeader,
  WorkspaceActions,
  RecentNotesTable,
} from "./-components";

const RECENT_NOTES_LIMIT = 10;

export const Route = createFileRoute("/workspace/$workspaceId/")({
  component: RouteComponent,
  loader: async ({ params: { workspaceId } }) =>
    await getWorkspaceSummary(workspaceId, RECENT_NOTES_LIMIT),
});

function RouteComponent() {
  const { notes, count } = Route.useLoaderData();
  const { workspaceId } = Route.useParams();

  return (
    <main className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 px-8 py-16">
      <WorkspaceHeader workspace={workspaceId} count={count} />
      <WorkspaceActions />
      <Separator />
      <RecentNotesTable notes={notes} workspaceId={workspaceId} />
    </main>
  );
}
