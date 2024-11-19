import { Button } from "@/components/ui/button/Button";
import { FolderPlus, Settings, SquarePen } from "lucide-react";

export const SidebarHeader = () => {
  return (
    <div className="flex h-11 items-center justify-center gap-2 border-b border-neutral-800">
      <Button>
        <SquarePen className="h-4 w-4" />
      </Button>
      <Button>
        <FolderPlus className="h-4 w-4" />
      </Button>
      <Button>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};
