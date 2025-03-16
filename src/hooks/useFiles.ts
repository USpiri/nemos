import { useNoteStore } from "@/store/note/note.store";
import { useSidebarStore } from "@/store/sidebar/sidebar.store";
import {
  copy,
  createDir,
  createNote as createNoteAction,
  deleteFile as deleteFileAction,
  deleteFolder as deleteFolderAction,
} from "@/utils/fs";
import { createNode, getNodeByPath } from "@/utils/tree-node";
import { useNavigate, useParams } from "react-router";

export const useFiles = () => {
  const addNode = useSidebarStore((store) => store.addNode);
  const setNote = useNoteStore((store) => store.setNote);
  const deleteNode = useSidebarStore((store) => store.deleteNode);
  const nodes = useSidebarStore((store) => store.tree);
  const navigate = useNavigate();
  const { "*": splat } = useParams();

  const createNote = async (path?: string) => {
    const { path: notePath, name } = await createNoteAction(path);
    const node = createNode({
      text: name,
      parent: getNodeByPath(nodes, path)?.id,
      path,
    });
    addNode(node);
    navigate(`/file/${notePath}`);
  };

  const createFolder = async (path?: string) => {
    const { name } = await createDir(path);
    const node = createNode({
      text: name!,
      parent: getNodeByPath(nodes, path)?.id,
      path,
      droppable: true,
    });
    addNode(node);
  };

  const copyFile = async (path: string) => {
    const { name } = await copy(path);
    const node = createNode({
      text: name!,
      parent: getNodeByPath(nodes, path)!.parent,
      path: path.substring(0, path.lastIndexOf("/")),
    });
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
