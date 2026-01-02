import { NoteError } from "@/lib/notes";
import { toast } from "sonner";
import { useCallback } from "react";
import { createNote as createNoteFn } from "@/lib/notes";
import { FILE_EXTENSION } from "@/config/constants";

interface Props {
  workspace: string;
}

export const useCreateNote = ({ workspace }: Props) => {
  const createNote = useCallback(
    async (noteName: string, onSuccess?: (notePath: string) => void) => {
      try {
        const notePath = await createNoteFn({
          workspace,
          path: `${noteName}${FILE_EXTENSION}`,
        });
        onSuccess?.(notePath);
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case "CREATE_FAILED":
              toast.error("Failed to create note");
              break;
          }
        }
      }
    },
    [workspace],
  );

  return { createNote };
};
