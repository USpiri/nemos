import { useUIStore } from "@/store/ui/ui.store";
import { Menu } from "lucide-react";
import { Button } from "../ui/button/Button";

export const Topbar = () => {
  const toogleSidebar = useUIStore((store) => store.toggleSidebar);
  return (
    <div className="flex h-11 items-center justify-between border-b border-neutral-800 px-2.5 print:hidden">
      <Button onClick={() => toogleSidebar()}>
        <Menu className="h-5 w-5" />
      </Button>
      File name and buttons
    </div>
  );
};
