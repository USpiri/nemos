import { linkOptions } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Link } from "./ui/link";
import { TreeNodeContextMenu } from "./TreeNodeContextMenu";

interface Props {
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  isDroppable: boolean;
  workspace: string;
  note: string;
  children: React.ReactNode;
}

export const WorkspaceTreeNode = ({
  depth,
  onToggle,
  isDroppable,
  workspace,
  note,
  children,
}: Props) => {
  const Component = isDroppable ? Button : Link;
  const props = isDroppable
    ? { onClick: onToggle }
    : linkOptions({
        to: "/workspace/$workspaceId/notes/$noteId",
        params: { workspaceId: workspace, noteId: note },
        activeProps: {
          className: "text-foreground!",
        },
      });
  return (
    <TreeNodeContextMenu
      isFolder={isDroppable}
      workspace={workspace}
      note={note}
    >
      <Component
        {...props}
        className="text-muted-foreground w-full justify-start rounded-none"
        variant="ghost"
        style={{ paddingInlineStart: depth * 10 + 8 }}
      >
        {children}
      </Component>
    </TreeNodeContextMenu>
  );
};
