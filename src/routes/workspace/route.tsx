import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Workspace Layout</h1>
      <Outlet />
    </>
  );
}
