import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { createDir, createNote as createNoteAction } from "@/utils/fs";
import { useNavigate } from "react-router";

// TODO:
// - Use Optimistic hook to update nodes (addNode) and update all
// nodes recusively. Implement rust call. This will solve errors when
// renaming or writing to inner notes from a renamed folder.

export const useSidebarActions = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const navigate = useNavigate();

  const createNote = async (path = "notes-app") => {
    const { path: notePath, name } = await createNoteAction(path);
    const node = {
      id: notePath,
      parent: path,
      droppable: false,
      text: name!,
    };
    addNode(node);
    navigate(`/file/${notePath}`);
  };

  const createFolder = async (path = "notes-app") => {
    const { path: filePath, name } = await createDir(path);
    const node = {
      id: filePath,
      parent: path,
      droppable: true,
      text: name!,
    };
    addNode(node);
  };

  return { createNote, createFolder };
};
