import { useDebouncedCallback } from "use-debounce";
import { Note, NoteError, writeNote } from "@/lib/notes";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

export const useNoteEditor = ({
  path,
  initialContent,
}: {
  path: string;
  initialContent: Note;
}) => {
  const lastSaved = useRef(initialContent);

  const saveFn = useCallback(
    async (note: Note) => {
      if (lastSaved.current.content === note.content) return;

      try {
        await writeNote(path, note);
        lastSaved.current = note;
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case "INVALID_CONTENT":
              toast.error("Invalid note content");
              break;
            default:
              toast.error("Failed to save note");
          }
        } else {
          toast.error("Failed to save note");
        }
      }
    },
    [path],
  );

  const save = useDebouncedCallback(saveFn, 1000);

  return { save };
};
