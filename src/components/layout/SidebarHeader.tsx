import {
  SidebarHeader as SidebarHeaderBase,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import { SquarePen, FolderPlus, Settings } from "lucide-react";

export const SidebarHeader = () => {
  return (
    <SidebarHeaderBase className="border-border border-b">
      <SidebarMenu className="h-full flex-row items-center justify-center gap-1">
        <SidebarMenuButton className="aspect-square w-[unset] items-center justify-center p-0">
          <SquarePen className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton className="aspect-square w-[unset] items-center justify-center p-0">
          <FolderPlus className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton className="aspect-square w-[unset] items-center justify-center p-0">
          <Settings className="size-4" />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeaderBase>
  );
};
