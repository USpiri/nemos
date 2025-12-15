import { Sidebar as SidebarBase } from "../ui/sidebar";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarContent } from "./SidebarContent";

export const Sidebar = () => {
  return (
    <SidebarBase>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </SidebarBase>
  );
};
