import { NoteError } from "@/lib/notes";
import { toast } from "sonner";
import { useCallback } from "react";
import { createNote as createNoteFn } from "@/lib/notes";
import { getRouteApi } from "@tanstack/react-router";
import { FILE_EXTENSION } from "@/config/constants";

const route = getRouteApi("/workspace/$workspaceId");

export const useCreateNote = () => {
  const { workspaceId: workspace } = route.useParams();

  const createNote = useCallback(
    async (noteName: string, onSuccess?: (notePath: string) => void) => {
      if (!workspace) {
        toast.error("Workspace not found");
        return;
      }

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
