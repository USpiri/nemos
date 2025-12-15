import { DirEntry } from "@tauri-apps/plugin-fs";

export const mapWorkspaceTree = (tree: (DirEntry & { path: string })[]) => {
  return tree.map((item) => ({
    id: item.path,
    parent: item.path.split("/").slice(0, -1).join("/"),
    text: item.name,
    droppable: item.isDirectory,
  }));
};
