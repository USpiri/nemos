import { Button } from "@/components/ui/button/Button";
import { useSidebarActions } from "@/hooks/useSidebarActions";
import { useUIStore } from "@/store/ui/ui.store";
import { FolderPlus, Settings, SquarePen } from "lucide-react";

export const SidebarHeader = () => {
  const toggleConfig = useUIStore((store) => store.toggleConfig);
  const { createNote, createFolder } = useSidebarActions();

  return (
    <div className="flex h-topbar items-center justify-center gap-2 border-b border-border">
      <Button onClick={createNote}>
        <SquarePen className="h-4 w-4" />
      </Button>
      <Button onClick={createFolder}>
        <FolderPlus className="h-4 w-4" />
      </Button>
      <Button onClick={() => toggleConfig(true)}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};
