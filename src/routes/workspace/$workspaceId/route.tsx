import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getWorkspaceTree } from "@/lib/workspace";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/workspace/$workspaceId")({
  component: RouteComponent,
  loader: async ({ params: { workspaceId } }) => {
    return {
      tree: await getWorkspaceTree(workspaceId),
    };
  },
});

function RouteComponent() {
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
  );
}
