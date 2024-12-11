import { Button } from "@/components/ui/button/Button";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { useUIStore } from "@/store/ui/ui.store";
import { createDir, createNote } from "@/utils/fs";
import { FolderPlus, Settings, SquarePen } from "lucide-react";
import { useNavigate } from "react-router";

export const SidebarHeader = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const toggleConfig = useUIStore((store) => store.toggleConfig);
  const navigate = useNavigate();

  const onCreateNote = async () => {
    const { path, name } = await createNote("notes-app");
    const node = {
      id: path,
      parent: "notes-app",
      droppable: false,
      text: name!,
    };
    addNode(node);
    navigate(`/file/${path}`);
  };

  const onCreateFolder = async () => {
    const { path, name } = await createDir("notes-app");
    const node = {
      id: path,
      parent: "notes-app",
      droppable: true,
      text: name!,
    };
    addNode(node);
  };

  return (
    <div className="flex h-topbar items-center justify-center gap-2 border-b border-border">
      <Button onClick={onCreateNote}>
        <SquarePen className="h-4 w-4" />
      </Button>
      <Button onClick={onCreateFolder}>
        <FolderPlus className="h-4 w-4" />
      </Button>
      <Button onClick={() => toggleConfig(true)}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};
