import { NodeModel } from "@/models/tree-node.interface";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import {
  copy,
  createDir,
  createNote as createNoteAction,
  deleteFile as deleteFileAction,
} from "@/utils/fs";
import { getNodeByPath } from "@/utils/tree-node";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

export const useSidebarActions = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const deleteNode = useSidebarStore((store) => store.deleteNode);
  const nodes = useSidebarStore((store) => store.tree);
  const navigate = useNavigate();
  const { "*": splat } = useParams();

  const createNote = async (path = "notes-app") => {
    const { path: notePath, name } = await createNoteAction(path);
    const node = {
      id: uuid(),
      parent: getNodeByPath(nodes, path)?.id ?? path,
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
      parent: getNodeByPath(nodes, path)?.id ?? path,
      droppable: true,
      text: name!,
      data: {
        path: filePath.substring(0, filePath.lastIndexOf("/")),
      },
    } as NodeModel;
    addNode(node);
  };

  const copyFile = async (path: string) => {
    const { path: filePath, name } = await copy(path);

    const node = {
      id: uuid(),
      parent: getNodeByPath(nodes, path)!.parent,
      droppable: false,
      text: name,
      data: {
        path: filePath.substring(0, filePath.lastIndexOf("/")),
      },
    } as NodeModel;
    addNode(node);
  };

  const deleteFile = async (path: string) => {
    await deleteFileAction(path)
      .then(() => {
        if (splat === path) navigate("/no-file");
      })
      .then(() => deleteNode(getNodeByPath(nodes, path)!));
  };

  return { createNote, createFolder, copyFile, deleteFile };
};
