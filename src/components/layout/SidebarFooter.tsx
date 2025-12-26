import { LogOut } from "lucide-react";
import { SidebarFooter as SidebarFooterBase } from "../ui/sidebar";
import { WorkspaceSelector } from "../WorkspaceSelector";
import { Link } from "../ui/link";

// TODO: Improve settings link
export const SidebarFooter = () => {
  return (
    <SidebarFooterBase className="border-border flex h-12 flex-row items-center justify-between border-t p-2">
      <WorkspaceSelector />
      <Link to="/workspace" variant="ghost" size="icon">
        <LogOut className="text-muted-foreground" />
      </Link>
    </SidebarFooterBase>
  );
};
