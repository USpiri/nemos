import { linkOptions, useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Link } from '../ui/link'
import { TreeNodeContextMenu } from './TreeNodeContextMenu'

interface Props {
  depth: number
  isOpen: boolean
  onToggle: () => void
  isDroppable: boolean
  isDragging: boolean
  isDropTarget: boolean
  root: string
  note: string
  children: React.ReactNode
}

export const TreeNode = ({
  depth,
  onToggle,
  isDroppable,
  isDragging,
  isDropTarget,
  root,
  note,
  children,
}: Props) => {
  const { rootPath } = useParams({ strict: false })
  const props = isDroppable
    ? { onClick: onToggle }
    : linkOptions({
        to: '/workspace/$rootPath/notes/$noteId',
        params: { rootPath: rootPath!, noteId: note },
        activeProps: {
          className: 'text-foreground!',
        },
      })

  return (
    <TreeNodeContextMenu isFolder={isDroppable} root={root} note={note}>
      <Link
        {...props}
        className={cn(
          'w-full justify-start rounded-none text-muted-foreground',
          isDragging && 'bg-muted opacity-40',
          isDropTarget && 'border-2 border-primary',
        )}
        variant="ghost"
        style={{ paddingInlineStart: depth * 10 + 8 }}
        title={note}
      >
        {children}
      </Link>
    </TreeNodeContextMenu>
  )
}
