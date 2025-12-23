import { DirEntry } from "@tauri-apps/plugin-fs";

export const mapWorkspaceTree = (tree: (DirEntry & { path: string })[]) => {
  return tree.map((item) => ({
    id: item.path,
    parent: item.path.split("/").slice(0, -1).join("/"),
    text: item.name,
    droppable: item.isDirectory,
  }));
};

export const isValidWorkspaceTreeEntry = (
  entry: DirEntry & { path: string },
) => {
  if (entry.isFile && !entry.name.endsWith(".note")) return false;
  if (hasHiddenParent(entry.path)) return false;
  return true;
};

export const hasHiddenParent = (path: string) => {
  return path.split("/").some((part) => part.startsWith("."));
};

export const isValidWorkspace = (entry: DirEntry & { path: string }) => {
  return entry.isDirectory && !entry.name.startsWith(".");
};
