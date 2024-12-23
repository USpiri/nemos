import { NodeModel } from "@/models/tree-node.interface";
import { getFilename } from "@/utils/fs";
import { getPath } from "@/utils/tree-node";
import { create } from "zustand";

interface State {
  tree: NodeModel[];
  setTree: (nodes: NodeModel[]) => void;
  addNode: (node: NodeModel) => void;
  updateNodeName: (from: string, to: string) => void;
}

export const useSidebarStore = create<State>()((set, get) => ({
  tree: [],
  setTree: (nodes) => set({ tree: nodes }),
  addNode: (node) => {
    const { tree } = get();
    set({ tree: [...tree, node] });
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
