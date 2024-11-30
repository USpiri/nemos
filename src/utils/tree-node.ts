import { NodeModel } from "@minoru/react-dnd-treeview";

export const getPath = (node: NodeModel) => `${node.parent}/${node.text}`;
