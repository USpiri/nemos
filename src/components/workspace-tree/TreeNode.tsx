import { linkOptions } from '@tanstack/react-router'
import { Link } from '../ui/link'
import { TreeNodeContextMenu } from './TreeNodeContextMenu'

interface Props {
  depth: number
  isOpen: boolean
  onToggle: () => void
  isDroppable: boolean
  workspace: string
  note: string
  children: React.ReactNode
}

export const TreeNode = ({
  depth,
  onToggle,
  isDroppable,
  workspace,
  note,
  children,
}: Props) => {
  const props = isDroppable
    ? { onClick: onToggle }
    : linkOptions({
        to: '/workspace/$workspaceId/notes/$noteId',
        params: { workspaceId: workspace, noteId: note },
        activeProps: {
          className: 'text-foreground!',
        },
      })

  return (
    <TreeNodeContextMenu
      isFolder={isDroppable}
      workspace={workspace}
      note={note}
    >
      <Link
        {...props}
        className="w-full justify-start rounded-none text-muted-foreground"
        variant="ghost"
        style={{ paddingInlineStart: depth * 10 + 8 }}
      >
        {children}
      </Link>
    </TreeNodeContextMenu>
  )
}
