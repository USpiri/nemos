import { toast } from "sonner";
import { useCallback } from "react";
import { copyNote as copyNoteFn } from "@/lib/notes";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/workspace/$workspaceId");

export const useCopyNote = () => {
  const { workspaceId: workspace } = route.useParams();

  const copyNote = useCallback(
    async (noteName: string, onSuccess?: (notePath: string) => void) => {
      if (!workspace) {
        toast.error("Workspace not found");
        return;
      }

      if (!noteName) {
        toast.error("Note name is required");
        return;
      }

      try {
        const notePath = await copyNoteFn({
          workspace,
          path: noteName,
        });
        onSuccess?.(notePath);
      } catch (error) {
        toast.error("Failed to copy note");
      }
    },
    [workspace],
  );

  return { copyNote };
};
