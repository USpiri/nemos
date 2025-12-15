import { Button } from "./ui/button";
import { Link } from "./ui/link";

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
    : {
        to: "/workspace/$workspaceId/notes/$noteId" as const,
        params: { workspaceId: workspace, noteId: note },
      };
  return (
    <Component
      {...props}
      className="text-muted-foreground w-full justify-start rounded-none"
      variant="ghost"
      style={{ paddingInlineStart: depth * 10 + 8 }}
    >
      {children}
    </Component>
  );
};
