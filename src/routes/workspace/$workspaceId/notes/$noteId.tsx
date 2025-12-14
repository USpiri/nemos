import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace/$workspaceId/notes/$noteId")({
  component: NoteIdComponent,
});

function NoteIdComponent() {
  return <div>Hello "/workspace/$workspaceId/notes/$noteId"!</div>;
}
