import { NoteError, deleteNote as deleteNoteFn } from "@/lib/notes";
import { useCallback } from "react";
import { toast } from "sonner";

interface Props {
  workspace: string;
}

export const useDeleteNote = ({ workspace }: Props) => {
  const deleteNote = useCallback(
    async (note: string) => {
      try {
        await deleteNoteFn({ workspace, note });
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case "DELETE_FAILED":
              toast.error("Failed to delete note", {
                description: error.message,
              });
              break;
          }
        } else {
          toast.error("Failed to delete note");
        }
      }
    },
    [workspace],
  );
  return { deleteNote };
};
