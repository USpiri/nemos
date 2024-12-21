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

export const SidebarContent = () => {
  const { tree, handleDrop } = useSidebar();

  return (
    <SidebarContentMenu>
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
    </SidebarContentMenu>
  );
};
