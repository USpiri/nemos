import { NodeModel } from "@/models/tree-node.interface";

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
        newActivePath = `${targetPath}/${node.text}`;

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
