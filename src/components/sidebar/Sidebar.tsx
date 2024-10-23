import { SidebarHeader } from "./sidebar-header/SidebarHeader";
import { SidebarContent } from "./sidebar-content/SidebarContent";
import { SidebarFooter } from "./sidebar-footer/SidebarFooter";
import { useSidebarResize } from "@/hooks/useSidebarResize";

export const Sidebar = () => {
  const { sidebarRef, width, startResizing } = useSidebarResize();

  return (
    <div
      className="relative grid min-w-40 max-w-80 grid-rows-[auto_1fr_auto] border-r border-neutral-800 print:hidden"
      ref={sidebarRef}
      style={{ width: width }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
      <div
        className="absolute right-0 top-0 h-full w-1.5 border-r-[3px] border-transparent transition-colors hover:cursor-ew-resize active:border-emerald-700"
        onMouseDown={startResizing}
      />
    </div>
  );
};
