import { SidebarTrigger } from "../ui/sidebar";

export const Topbar = () => {
  return (
    <div className="border-border flex items-center justify-between border-b px-2.5 py-2">
      <SidebarTrigger className="size-8" />
    </div>
  );
};
