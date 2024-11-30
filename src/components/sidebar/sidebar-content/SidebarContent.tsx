import {
  getBackendOptions,
  MultiBackend,
  Tree,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { TreeNode } from "./tree-node/TreeNode";
import { useSidebar } from "@/hooks/useSidebar";
import { getPath } from "@/utils/tree-node";

export const SidebarContent = () => {
  const { tree, loadChildrens, handleDrop } = useSidebar();

  return (
    <div className="mt-5 w-full overflow-hidden p-2">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={tree}
          rootId={"notes-app"}
          dropTargetOffset={5}
          render={(node, { depth, isOpen, onToggle }) => (
            <TreeNode
              node={node}
              isOpen={isOpen}
              depth={depth}
              onToggle={() => {
                onToggle();
                loadChildrens(getPath(node));
              }}
            />
          )}
          canDrop={(_, { dragSource, dropTargetId }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          classes={{
            draggingSource: "opacity-20",
          }}
          onDrop={handleDrop}
          placeholderRender={(_, { depth }) => <Placeholder depth={depth} />}
        />
      </DndProvider>
    </div>
  );
};

interface PlaceholderProps {
  depth: number;
}

const Placeholder = ({ depth }: PlaceholderProps) => {
  return (
    <div
      className="absolute right-0 mx-2 h-0.5 bg-detail"
      style={{ left: depth * 15 }}
    />
  );
};
