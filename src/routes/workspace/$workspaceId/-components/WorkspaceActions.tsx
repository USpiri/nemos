import { Button } from "@/components/ui/button";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";
import { getRouteApi } from "@tanstack/react-router";
import { Download, FolderPlus, Plus } from "lucide-react";

const route = getRouteApi("/workspace/$workspaceId");

export const WorkspaceActions = () => {
  const { workspaceId } = route.useParams();

  const { createNoteAndNavigate, createFolderAndRefresh } = useWorkspaceActions(
    {
      workspace: workspaceId,
    },
  );

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button onClick={() => createNoteAndNavigate()}>
        <Plus />
        New Note
      </Button>
      <Button variant="outline" onClick={() => createFolderAndRefresh()}>
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
