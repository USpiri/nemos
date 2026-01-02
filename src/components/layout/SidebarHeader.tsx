import {
  SidebarHeader as SidebarHeaderBase,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import { SquarePen, FolderPlus, Settings } from "lucide-react";
import { getRouteApi } from "@tanstack/react-router";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";

const route = getRouteApi("/workspace/$workspaceId");

export const SidebarHeader = () => {
  const { workspaceId } = route.useParams();

  const { createNoteAndNavigate, createFolderAndRefresh } = useWorkspaceActions(
    {
      workspace: workspaceId,
    },
  );

  return (
    <SidebarHeaderBase className="border-border border-b">
      <SidebarMenu className="h-full flex-row items-center justify-center gap-1">
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={() => createNoteAndNavigate()}
        >
          <SquarePen className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={() => createFolderAndRefresh()}
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
