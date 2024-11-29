import { Button } from "@/components/ui/button/Button";
import { useActiveFile } from "@/hooks/useActiveFile";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { createNote, getTreeNodeFiles } from "@/utils/fs";
import { FolderPlus, Settings, SquarePen } from "lucide-react";

export const SidebarHeader = () => {
  const mergeTree = useSidebarStore((store) => store.mergeTree);
  const { setActiveFile } = useActiveFile();

  const onCreateNote = async () => {
    const { path } = await createNote("notes-app");
    const nodes = await getTreeNodeFiles("notes-app");
    mergeTree(nodes);
    setActiveFile(path);
  };

  return (
    <div className="flex h-topbar items-center justify-center gap-2 border-b border-neutral-800">
      <Button onClick={onCreateNote}>
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
