import { useCreateFolder } from "@/hooks/use-create-folder";
import {
  getNewFolderPath,
  getNewNotePath,
  getNoteIdFromPath,
} from "@/lib/notes";
import { useCreateNote } from "@/hooks/use-create-note";
import { useCallback } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCopyNote } from "@/hooks/use-copy-note";
import { toast } from "sonner";
import { useRenameNote } from "./use-rename-note";
import { useRenameFolder } from "./use-rename-folder";

interface Props {
  workspace: string;
}

// TODO: Update useCallback dependencies
export const useWorkspaceActions = ({ workspace }: Props) => {
  const navigate = useNavigate();
  const router = useRouter();

  const { createNote: createNoteFn } = useCreateNote({ workspace });
  const { createFolder: createFolderFn } = useCreateFolder({ workspace });
  const { copyNote: copyNoteFn } = useCopyNote({ workspace });
  const { renameNote: renameNoteFn } = useRenameNote({ workspace });
  const { renameFolder: renameFolderFn } = useRenameFolder({ workspace });

  const createNote = useCallback(async (note = "") => {
    const path = getNewNotePath(note);
    const notePath = await createNoteFn(path);
    if (!notePath) return;
    return getNoteIdFromPath(notePath);
  }, []);

  const createFolder = useCallback(async (folder = "") => {
    const path = getNewFolderPath(folder);
    const folderPath = await createFolderFn(path);
    if (!folderPath) return;
    return getNoteIdFromPath(folderPath);
  }, []);

  const copyNote = useCallback(async (note: string) => {
    await copyNoteFn(note, (notePath) => {
      navigateToNote(getNoteIdFromPath(notePath));
    });
  }, []);

  const renameNote = useCallback(async (note: string, newName: string) => {
    const notePath = await renameNoteFn(note, newName);
    if (!notePath) return;
    return getNoteIdFromPath(notePath);
  }, []);

  const renameFolder = useCallback(async (folder: string, newName: string) => {
    const folderPath = await renameFolderFn(folder, newName);
    if (!folderPath) return;
    return getNoteIdFromPath(folderPath);
  }, []);

  const deleteNote = useCallback(async (note: string) => {
    console.log("Delete note:", note);
    toast.info("Delete note feature coming soon");
  }, []);

  const deleteFolder = useCallback(async (folder: string) => {
    console.log("Delete folder:", folder);
    toast.info("Delete folder feature coming soon");
  }, []);

  const revealInExplorer = useCallback(() => {
    console.log("Reveal in File Explorer");
    toast.info("Reveal in File Explorer feature coming soon");
  }, []);

  const refreshWorkspace = useCallback(() => {
    router.invalidate({
      filter: (route) => route.id === "/workspace/$workspaceId",
    });
  }, []);

  const navigateToNote = useCallback((noteId: string) => {
    navigate({
      to: "/workspace/$workspaceId/notes/$noteId",
      params: { workspaceId: workspace, noteId },
    });
  }, []);

  const createNoteAndNavigate = useCallback(async (note = "") => {
    const notePath = await createNote(note);
    if (!notePath) return;
    navigateToNote(notePath);
  }, []);

  const createFolderAndRefresh = useCallback(async (folder = "") => {
    const folderPath = await createFolder(folder);
    if (!folderPath) return;
    refreshWorkspace();
  }, []);

  const renameNoteAndRefresh = useCallback(
    async (note: string, newName: string) => {
      const notePath = await renameNote(note, newName);
      if (!notePath) return;
      refreshWorkspace();
    },
    [],
  );

  const renameFolderAndRefresh = useCallback(
    async (folder: string, newName: string) => {
      const folderPath = await renameFolder(folder, newName);
      if (!folderPath) return;
      refreshWorkspace();
    },
    [],
  );

  return {
    createNote,
    createFolder,
    copyNote,
    deleteNote,
    deleteFolder,
    renameNote,
    renameFolder,
    refreshWorkspace,
    navigateToNote,
    revealInExplorer,
    createNoteAndNavigate,
    createFolderAndRefresh,
    renameNoteAndRefresh,
    renameFolderAndRefresh,
  };
};
