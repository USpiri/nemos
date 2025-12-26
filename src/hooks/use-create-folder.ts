import { toast } from "sonner";
import { useCallback } from "react";
import { createFolder as createFolderFn, NoteError } from "@/lib/notes";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/workspace/$workspaceId");

export const useCreateFolder = () => {
  const { workspaceId: workspace } = route.useParams();

  const createFolder = useCallback(
    async (folderName: string, onSuccess?: () => void) => {
      if (!workspace) {
        toast.error("Workspace not found");
        return;
      }

      try {
        await createFolderFn({ workspace, path: folderName });
        onSuccess?.();
      } catch (error) {
        if (error instanceof NoteError) {
          switch (error.code) {
            case "CREATE_FAILED":
              toast.error("Failed to create folder");
              break;
          }
        }
      }
    },
    [workspace],
  );

  return { createFolder };
};
