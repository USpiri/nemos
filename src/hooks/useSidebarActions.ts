import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { createDir, createNote as createNoteAction } from "@/utils/fs";
import { useNavigate } from "react-router";

export const useSidebarActions = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const navigate = useNavigate();

  const createNote = async () => {
    const { path, name } = await createNoteAction("notes-app");
    const node = {
      id: path,
      parent: "notes-app",
      droppable: false,
      text: name!,
    };
    addNode(node);
    navigate(`/file/${path}`);
  };

  const createFolder = async () => {
    const { path, name } = await createDir("notes-app");
    const node = {
      id: path,
      parent: "notes-app",
      droppable: true,
      text: name!,
    };
    addNode(node);
  };

  return { createNote, createFolder };
};
