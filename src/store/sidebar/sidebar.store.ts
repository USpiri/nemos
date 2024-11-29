import { NodeModel } from "@minoru/react-dnd-treeview";
import { create } from "zustand";

interface State {
  tree: NodeModel[];
  setTree: (nodes: NodeModel[]) => void;
  mergeTree: (nodes: NodeModel[]) => void;
}

export const useSidebarStore = create<State>()((set, get) => ({
  tree: [],
  setTree: (nodes) => set({ tree: nodes }),
  mergeTree: (nodes) => {
    const { tree } = get();
    const newTree = [
      ...nodes,
      ...tree.filter((i) => !nodes.map((i) => i.id).includes(i.id)),
    ];
    set({ tree: newTree });
  },
}));
