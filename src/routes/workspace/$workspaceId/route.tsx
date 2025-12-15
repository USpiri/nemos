import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getWorkspaceTree } from "@/lib/workspace";

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
      <div className="w-full">
        <Topbar />
        <Outlet />
      </div>
    </>
  );
}
