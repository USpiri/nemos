import {
  getBackendOptions,
  MultiBackend,
  Tree,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { useSidebar } from "@/hooks/useSidebar";
import { PlaceholderNode } from "@/components/ui/tree-node/PlaceholderNode";
import { TreeNode } from "@/components/ui/tree-node/TreeNode";
import { SidebarContentMenu } from "./SidebarContentMenu";
import { useRef } from "react";
import { ROOT_FOLDER } from "@/config/constants";

export const SidebarContent = () => {
  const { tree, handleDrop } = useSidebar();
  const contextRef = useRef(null);

  return (
    <SidebarContentMenu>
      <div ref={contextRef} className="overflow-hidden py-4">
        {contextRef.current && (
          <DndProvider
            backend={MultiBackend}
            options={getBackendOptions()}
            context={contextRef.current}
          >
            <Tree
              tree={tree}
              rootId={ROOT_FOLDER}
              dropTargetOffset={5}
              render={(node, { depth, isOpen, onToggle }) => (
                <TreeNode
                  node={node}
                  isOpen={isOpen}
                  depth={depth}
                  onToggle={onToggle}
                />
              )}
              canDrop={(_, { dragSource, dropTargetId }) => {
                if (dragSource?.parent === dropTargetId) {
                  return true;
                }
              }}
              classes={{
                root: "h-full",
                draggingSource: "opacity-20",
              }}
              onDrop={handleDrop}
              placeholderRender={(_, { depth }) => (
                <PlaceholderNode depth={depth} />
              )}
            />
          </DndProvider>
        )}
      </div>
    </SidebarContentMenu>
  );
};
