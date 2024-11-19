import { SidebarHeader } from "./sidebar-header/SidebarHeader";
import { SidebarContent } from "./sidebar-content/SidebarContent";
import { SidebarFooter } from "./sidebar-footer/SidebarFooter";
import { useSidebarResize } from "@/hooks/useSidebarResize";
import "./sidebar.css";
import { useUIStore } from "@/store/ui/ui.store";

export const Sidebar = () => {
  const isOpen = useUIStore((store) => store.isSidebarOpen);
  const { sidebarRef, width, startResizing } = useSidebarResize();

  return (
    <div
      className={`sidebar relative grid grid-rows-[auto_1fr_auto] overflow-hidden print:hidden ${
        isOpen ? "open" : "close"
      }`}
      ref={sidebarRef}
      style={{ width: isOpen ? width : 0 }}
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
