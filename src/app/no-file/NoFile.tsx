import { Button } from "@/components/ui/button/Button";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { useUIStore } from "@/store/ui/ui.store";
import { createNote } from "@/utils/fs";
import { useNavigate } from "react-router";

export const NoFile = () => {
  const toggleSidebar = useUIStore((store) => store.toggleSidebar);
  const addNode = useSidebarStore((store) => store.addNode);
  const navigate = useNavigate();

  const onCreateNote = async () => {
    const { path, fileName } = await createNote("notes-app");
    const node = {
      id: path,
      parent: "notes-app",
      droppable: false,
      text: fileName,
    };
    addNode(node);
    navigate(`/file/${path}`);
  };

  const onNavigate = () => {
    toggleSidebar(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-8 pt-32">
      <h1 className="text-4xl font-semibold">There is something missing!</h1>
      <p className="text-foreground-darker">
        Navigate to a new file or create a new one!
      </p>
      <hr className="border-foreground-darker" />
      <div className="flex gap-2 *:text-foreground">
        <Button className="px-4" onClick={onNavigate}>
          Navigate
        </Button>
        <Button className="px-4" onClick={onCreateNote}>
          Create new Note
        </Button>
      </div>
    </div>
  );
};
