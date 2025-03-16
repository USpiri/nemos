import { ROOT_FOLDER } from "@/config/constants";
import { NodeModel } from "@/models/tree-node.interface";
import { v4 as uuid } from "uuid";

export const getPath = (node: NodeModel) => `${node.data!.path}/${node.text}`;

export const updateNodes = (
  nodes: NodeModel[],
  targetPath: string,
  sourcePath: string,
  activeNotePath: string,
  newName?: string,
) => {
  let newActivePath = null;
  const updatedNodes = nodes.map((node) => {
    const currentNodePath = getPath(node);

    //Update inner nodes
    if (node.data!.path.includes(sourcePath)) {
      const newPath = node.data!.path.replace(sourcePath, targetPath);
      if (currentNodePath === activeNotePath)
        newActivePath = `${newPath}/${node.text}`;

      return {
        ...node,
        data: { ...node.data, path: newPath },
      };
    }

    // Update current node
    if (sourcePath === currentNodePath)
      return {
        ...node,
        text: newName ?? node.text,
        data: {
          ...node.data,
          path: targetPath.substring(0, targetPath.lastIndexOf("/")),
        },
      };

    // Others unchanged...
    return node;
  }) as NodeModel[];

  return { updatedNodes, newActivePath };
};

export const getNodeByPath = (nodes: NodeModel[], path?: string) => {
  return nodes.find((node) => getPath(node) === (path ?? ROOT_FOLDER));
};

interface CreateNodeOptions {
  parent?: string | number;
  text: string;
  path?: string;
  droppable?: boolean;
}

export const createNode = ({
  parent = ROOT_FOLDER,
  text,
  path = ROOT_FOLDER,
  droppable,
}: CreateNodeOptions) =>
  ({
    id: uuid(),
    parent: parent,
    droppable: !!droppable,
    text,
    data: {
      path: path ?? parent,
    },
  }) as NodeModel;
