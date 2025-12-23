import { FILE_EXTENSION } from "@/config/constants";
import { getWorkspacePath } from "./service/path";
import { WorkspaceEntry } from "./workspace.type";

export const mapWorkspaceTree = (tree: WorkspaceEntry[]) => {
  return tree.map((item) => ({
    id: item.path,
    parent: item.path.split("/").slice(0, -1).join("/"),
    text: item.name,
    droppable: item.isDirectory,
  }));
};

export const isValidWorkspaceTreeEntry = (entry: WorkspaceEntry) => {
  if (entry.isFile && !entry.name.endsWith(FILE_EXTENSION)) return false;
  if (hasHiddenParent(entry.path)) return false;
  return true;
};

export const hasHiddenParent = (path: string) => {
  return path.split("/").some((part) => part.startsWith("."));
};

export const isValidWorkspaceDirectory = (entry: WorkspaceEntry) => {
  return entry.isDirectory && !entry.name.startsWith(".");
};

export const isNoteFile = (entry: WorkspaceEntry) => {
  return entry.isFile && entry.name.endsWith(FILE_EXTENSION);
};

export const getNoteRelativeDir = (path: string, workspaceId: string) => {
  const workspaceRoot = `${getWorkspacePath(workspaceId)}/`;
  const relative = path.replace(workspaceRoot, "");
  const parts = relative.split("/");
  return parts.length === 1 ? "/" : `/${parts.slice(0, -1).join("/")}`;
};
