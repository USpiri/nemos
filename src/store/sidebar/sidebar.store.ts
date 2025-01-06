import { NodeModel } from "@/models/tree-node.interface";
import { getFilename } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
import { getDescendants } from "@minoru/react-dnd-treeview";
import { create } from "zustand";

interface State {
  tree: NodeModel[];
  setTree: (nodes: NodeModel[]) => void;
  addNode: (node: NodeModel) => void;
  deleteNode: (node: NodeModel) => void;
  updateNodeName: (from: string, to: string) => void;
}

export const useSidebarStore = create<State>()((set, get) => ({
  tree: [],
  setTree: (nodes) => set({ tree: nodes }),
  addNode: (node) => {
    const { tree } = get();
    set({ tree: [...tree, node] });
  },
  deleteNode: (nodeToDelete) => {
    const { tree } = get();
    const deleteIds = [
      nodeToDelete.id,
      ...getDescendants(tree, nodeToDelete.id).map((node) => node.id),
    ];
    const updatedTree = tree.filter((node) => !deleteIds.includes(node.id));
    set({ tree: updatedTree });
  },
  updateNodeName: (from, to) => {
    const { tree } = get();
    const updatedTree = tree.map((node) =>
      getPath(node) !== from
        ? node
        : {
            ...node,
            id: to,
            text: getFilename(to),
          },
    );
    set({ tree: updatedTree });
  },
}));
