import { ROOT_FOLDER } from "@/config/constants";
import { NodeModel } from "@/models/tree-node.interface";
import { useNoteStore } from "@/store/note/note.store";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import {
  copy,
  createDir,
  createNote as createNoteAction,
  deleteFile as deleteFileAction,
  deleteFolder as deleteFolderAction,
} from "@/utils/fs";
import { getNodeByPath } from "@/utils/tree-node";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

export const useSidebarActions = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const setNote = useNoteStore((store) => store.setNote);
  const deleteNode = useSidebarStore((store) => store.deleteNode);
  const nodes = useSidebarStore((store) => store.tree);
  const navigate = useNavigate();
  const { "*": splat } = useParams();

  const createNote = async (path = ROOT_FOLDER) => {
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

  const createFolder = async (path = ROOT_FOLDER) => {
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
      .then(() => {
        setNote(null);
        deleteNode(getNodeByPath(nodes, path)!);
      });
  };

  const deleteFolder = async (path: string) => {
    await deleteFolderAction(path)
      .then(() => {
        if (splat === path) navigate("/no-file");
      })
      .then(() => deleteNode(getNodeByPath(nodes, path)!));
  };

  return { createNote, createFolder, copyFile, deleteFile, deleteFolder };
};
