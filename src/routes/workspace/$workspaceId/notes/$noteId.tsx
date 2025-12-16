import { Editor } from "@/components/editor";
import { readNote } from "@/lib/notes";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/workspace/$workspaceId/notes/$noteId")({
  component: NoteIdComponent,
  loader: ({ params: { workspaceId, noteId } }) =>
    readNote(`${workspaceId}/${noteId}`),
});

function NoteIdComponent() {
  const note = Route.useLoaderData();
  const content = useMemo(() => note.content, [note]);

  return (
    <main>
      <Editor
        content={content}
        className="mx-auto w-full max-w-3xl px-10 py-32"
      />
    </main>
  );
}
