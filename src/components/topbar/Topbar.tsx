import { useUIStore } from "@/store/ui/ui.store";
import { EllipsisVertical, Menu } from "lucide-react";
import { Button } from "../ui/button/Button";

export const Topbar = () => {
  const toogleSidebar = useUIStore((store) => store.toggleSidebar);
  return (
    <div className="h-topbar flex items-center justify-between border-b border-border px-2.5 print:hidden">
      <Button onClick={() => toogleSidebar()}>
        <Menu className="h-4 w-4" />
      </Button>
      <p className="text-sm text-foreground/65">hello.note</p>
      <Button>
        <EllipsisVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};
