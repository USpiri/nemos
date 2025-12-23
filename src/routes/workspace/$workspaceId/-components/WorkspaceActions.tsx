import { Button } from "@/components/ui/button";
import { Download, FolderPlus, Plus } from "lucide-react";

export const WorkspaceActions = () => {
  return (
    <div className="flex flex-row gap-2">
      <Button>
        <Plus />
        New Note
      </Button>
      <Button variant="outline">
        <FolderPlus />
        New Folder
      </Button>
      <Button variant="ghost">
        <Download />
        Import Notes
      </Button>
    </div>
  );
};
