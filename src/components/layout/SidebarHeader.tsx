import { useCreateNote } from "@/hooks/use-create-note";
import {
  SidebarHeader as SidebarHeaderBase,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import { SquarePen, FolderPlus, Settings } from "lucide-react";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { getNoteIdFromPath } from "@/lib/notes";

const route = getRouteApi("/workspace/$workspaceId");

export const SidebarHeader = () => {
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
    <SidebarHeaderBase className="border-border border-b">
      <SidebarMenu className="h-full flex-row items-center justify-center gap-1">
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={handleCreateNote}
        >
          <SquarePen className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={handleCreateFolder}
        >
          <FolderPlus className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton className="aspect-square w-[unset] items-center justify-center p-0">
          <Settings className="size-4" />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeaderBase>
  );
};
