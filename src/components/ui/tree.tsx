import {
  DropOptions,
  getBackendOptions,
  MultiBackend,
  NodeModel,
  Tree as TreeView,
  NodeRender,
  Classes,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

interface TreeProps {
  tree: NodeModel[];
  rootId: string;
  onDrop: (tree: NodeModel<unknown>[], options: DropOptions<unknown>) => void;
  render: NodeRender<unknown>;
  classes?: Classes;
}

export const Tree = ({ tree, rootId, onDrop, render, classes }: TreeProps) => {
  return (
    <>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <TreeView
          tree={tree}
          rootId={rootId}
          render={render}
          onDrop={onDrop}
          classes={classes}
        />
      </DndProvider>
    </>
  );
};
