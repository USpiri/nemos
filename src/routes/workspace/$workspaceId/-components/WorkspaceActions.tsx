import { Button } from "@/components/ui/button";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useCreateNote } from "@/hooks/use-create-note";
import { getNoteIdFromPath } from "@/lib/notes";
import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { Download, FolderPlus, Plus } from "lucide-react";
import { useCallback } from "react";

const route = getRouteApi("/workspace/$workspaceId");

export const WorkspaceActions = () => {
  const { workspaceId } = route.useParams();
  const router = useRouter();
  const navigate = useNavigate();

  const { createNote } = useCreateNote({ workspace: workspaceId });
  const { createFolder } = useCreateFolder({ workspace: workspaceId });

  const handleCreateNote = useCallback(() => {
    createNote("new-note", (notePath) => {
      navigate({
        to: "/workspace/$workspaceId/notes/$noteId",
        params: { workspaceId, noteId: getNoteIdFromPath(notePath) },
      });
    });
  }, []);

  const handleCreateFolder = useCallback(() => {
    createFolder("new-folder", () => {
      router.invalidate({
        filter: (route) => route.id === "/workspace/$workspaceId",
      });
    });
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button onClick={handleCreateNote}>
        <Plus />
        New Note
      </Button>
      <Button variant="outline" onClick={handleCreateFolder}>
        <FolderPlus />
        New Folder
      </Button>
      <Button variant="ghost">
        <Download />
        Import Notes
      </Button>
    </div>
  );
};
