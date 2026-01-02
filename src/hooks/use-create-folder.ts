import { toast } from "sonner";
import { useCallback } from "react";
import { createFolder as createFolderFn, NoteError } from "@/lib/notes";

interface Props {
  workspace: string;
}

export const useCreateFolder = ({ workspace }: Props) => {
  const createFolder = useCallback(
    async (folderName: string, onSuccess?: () => void) => {
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
