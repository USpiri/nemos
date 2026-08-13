import type { Editor } from '@tiptap/react'
import { GripHorizontal, GripVertical } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  setTableHandleFrozen,
  TABLE_HANDLE_OVERLAY_CLASS,
} from './handle-plugin'
import { useTableHandleState } from './use-table-handle-state'

const HANDLE_SIZE = 20
const HANDLE_GAP = 4

interface HandleMenuItem {
  label: string
  disabled?: boolean
  onClick: () => void
}

type HandleMenuEntry = HandleMenuItem | 'separator'

function HandleMenu({
  icon,
  ariaLabel,
  style,
  side,
  items,
}: {
  icon: ReactNode
  ariaLabel: string
  style: CSSProperties
  side: 'left' | 'bottom'
  items: HandleMenuEntry[]
}) {
  return (
    <div className={cn(TABLE_HANDLE_OVERLAY_CLASS, 'z-40')} style={style}>
      <DropdownMenu onOpenChange={setTableHandleFrozen}>
        <DropdownMenuTrigger
          aria-label={ariaLabel}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon-xs' }),
            'bg-background',
          )}
        >
          {icon}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={TABLE_HANDLE_OVERLAY_CLASS}
          side={side}
          align="center"
        >
          {items.map((item, index) =>
            item === 'separator' ? (
              <DropdownMenuSeparator key={`separator-${index}`} />
            ) : (
              <DropdownMenuItem
                key={item.label}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface Props {
  editor: Editor | null
}

export function TableHandles({ editor }: Props) {
  const state = useTableHandleState(editor)

  if (!editor || !state) return null

  const {
    tablePos,
    rowIndex,
    colIndex,
    isHeaderRow,
    rowCount,
    colCount,
    tableRect,
    cellRect,
  } = state

  const rowHandleStyle: CSSProperties = {
    position: 'fixed',
    left: tableRect.left - HANDLE_SIZE - HANDLE_GAP,
    top: cellRect.top + cellRect.height / 2 - HANDLE_SIZE / 2,
  }

  const colHandleStyle: CSSProperties = {
    position: 'fixed',
    left: cellRect.left + cellRect.width / 2 - HANDLE_SIZE / 2,
    top: tableRect.top - HANDLE_SIZE - HANDLE_GAP,
  }

  return createPortal(
    <>
      <HandleMenu
        icon={<GripVertical className="size-3" />}
        ariaLabel="Row options"
        style={rowHandleStyle}
        side="left"
        items={[
          {
            label: 'Insert row above',
            disabled: isHeaderRow,
            onClick: () => editor.commands.insertRow(tablePos, rowIndex),
          },
          {
            label: 'Insert row below',
            onClick: () => editor.commands.insertRow(tablePos, rowIndex + 1),
          },
          'separator',
          {
            label: 'Duplicate row',
            onClick: () => editor.commands.duplicateRow(tablePos, rowIndex),
          },
          {
            label: 'Delete row',
            disabled: isHeaderRow || rowCount <= 2,
            onClick: () => editor.commands.deleteRow(tablePos, rowIndex),
          },
        ]}
      />

      <HandleMenu
        icon={<GripHorizontal className="size-3" />}
        ariaLabel="Column options"
        style={colHandleStyle}
        side="bottom"
        items={[
          {
            label: 'Insert column left',
            onClick: () => editor.commands.insertColumn(tablePos, colIndex),
          },
          {
            label: 'Insert column right',
            onClick: () => editor.commands.insertColumn(tablePos, colIndex + 1),
          },
          'separator',
          {
            label: 'Duplicate column',
            onClick: () => editor.commands.duplicateColumn(tablePos, colIndex),
          },
          {
            label: 'Delete column',
            disabled: colCount <= 1,
            onClick: () => editor.commands.deleteColumn(tablePos, colIndex),
          },
        ]}
      />
    </>,
    document.body,
  )
}
