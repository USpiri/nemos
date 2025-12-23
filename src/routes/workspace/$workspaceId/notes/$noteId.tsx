import { Editor } from "@/components/editor";
import { useNoteEditor } from "@/hooks/use-note-editor";
import { readNote } from "@/lib/notes";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { NoteError, NotePending } from "./-components";

export const Route = createFileRoute("/workspace/$workspaceId/notes/$noteId")({
  component: NoteIdComponent,
  pendingComponent: NotePending,
  errorComponent: NoteError,
  loader: ({ params: { workspaceId, noteId } }) =>
    readNote(`${workspaceId}/${noteId}`),
});

function NoteIdComponent() {
  const { workspaceId, noteId } = Route.useParams();
  const note = Route.useLoaderData();

  const content = useMemo(() => note.content, [note]);

  const { save } = useNoteEditor({
    path: `${workspaceId}/${noteId}`,
    initialContent: note,
  });

  return (
    <main>
      <Editor
        content={content}
        className="mx-auto w-full max-w-3xl px-10 py-32"
        onUpdate={(content) => save({ content })}
      />
    </main>
  );
}
