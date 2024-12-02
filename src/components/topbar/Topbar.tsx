import { useUIStore } from "@/store/ui/ui.store";
import { EllipsisVertical, Menu } from "lucide-react";
import { Button } from "../ui/button/Button";
import { Filename } from "./filename/Filename";

export const Topbar = () => {
  const toogleSidebar = useUIStore((store) => store.toggleSidebar);

  return (
    <div className="flex h-topbar items-center justify-between border-b border-border px-2.5 print:hidden">
      <Button onClick={() => toogleSidebar()}>
        <Menu className="h-4 w-4" />
      </Button>
      <Filename />
      <Button>
        <EllipsisVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};
