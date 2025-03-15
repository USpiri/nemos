import { Button } from "@/components/ui/button/Button";
import { ROOT_FOLDER } from "@/config/constants";
import { NodeModel } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { useUIStore } from "@/store/ui/ui.store";
import { createNote } from "@/utils/fs";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";

export const NoFile = () => {
  const toggleSidebar = useUIStore((store) => store.toggleSidebar);
  const addNode = useSidebarStore((store) => store.addNode);
  const navigate = useNavigate();

  const onCreateNote = async () => {
    const { path, name } = await createNote(ROOT_FOLDER);
    const node = {
      id: uuid(),
      parent: ROOT_FOLDER,
      droppable: false,
      text: name!,
      data: {
        path: path.substring(0, path.lastIndexOf("/")),
      },
    } as NodeModel;
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
        Navigate to an existing file or create a new one!
      </p>
      <hr className="border-foreground-faint" />
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
