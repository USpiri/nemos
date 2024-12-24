import { NodeModel } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import { createDir, createNote as createNoteAction } from "@/utils/fs";
import { getParentByPath } from "@/utils/tree-node";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";

export const useSidebarActions = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const nodes = useSidebarStore((store) => store.tree);
  const navigate = useNavigate();

  const createNote = async (path = "notes-app") => {
    const { path: notePath, name } = await createNoteAction(path);
    const node = {
      id: uuid(),
      parent: getParentByPath(nodes, path)?.id ?? path,
      droppable: false,
      text: name!,
      data: {
        path: notePath.substring(0, notePath.lastIndexOf("/")),
      },
    } as NodeModel;
    addNode(node);
    navigate(`/file/${notePath}`);
  };

  const createFolder = async (path = "notes-app") => {
    const { path: filePath, name } = await createDir(path);
    const node = {
      id: uuid(),
      parent: getParentByPath(nodes, path)?.id ?? path,
      droppable: true,
      text: name!,
      data: {
        path: filePath.substring(0, filePath.lastIndexOf("/")),
      },
    } as NodeModel;
    addNode(node);
  };

  return { createNote, createFolder };
};
