import { SidebarFooter as SidebarFooterBase } from "../ui/sidebar";
import { WorkspaceSelector } from "../WorkspaceSelector";

// TODO: Add workspace switcher
export const SidebarFooter = () => {
  return (
    <SidebarFooterBase className="border-border h-12 border-t p-2">
      <WorkspaceSelector />
    </SidebarFooterBase>
  );
};
