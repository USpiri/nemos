import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Navigate
      to="/workspace/$workspaceId/notes/$noteId"
      params={{ workspaceId: "workspace-2", noteId: "notes/index.note" }}
    />
  );
}
