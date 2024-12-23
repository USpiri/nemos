import { DirEntry } from "@tauri-apps/plugin-fs";
import { NodeModel as OriginalNodeModel } from "@minoru/react-dnd-treeview";

export interface NodeModelData extends DirEntry {
  path: string;
  id: string;
  parentId?: string;
}

export type NodeModel = OriginalNodeModel<NodeModelData>;
