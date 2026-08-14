import type { Editor } from '@tiptap/react'
import { Ellipsis, EllipsisVertical } from 'lucide-react'
import type { CSSProperties, DragEvent, ReactNode } from 'react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TableAlign } from './align'
import { createTableDragImage } from './drag-image'
import {
  beginTableDrag,
  endTableDrag,
  setTableHandleFrozen,
  TABLE_HANDLE_OVERLAY_CLASS,
  type TableDragInfo,
} from './handle-plugin'
import { useTableHandleState } from './use-table-handle-state'

const HANDLE_SIZE = 20
const HANDLE_GAP = 4
const DROP_LINE_THICKNESS = 3

function handleDragStart(
  event: DragEvent,
  editor: Editor,
  orientation: 'row' | 'col',
  tablePos: number,
  index: number,
) {
  beginTableDrag(orientation, tablePos, index)

  // A clone of the actual row/column being dragged, so the drag image looks
  // like the real thing instead of the browser's default screenshot of this
  // (invisible, off-table) handle wrapper — which renders as a blank box.
  const image = createTableDragImage(editor, orientation, index, tablePos)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/x-nemos-table-handle', String(index))
  event.dataTransfer.setDragImage(image, 0, 0)
  setTimeout(() => image.remove(), 0)
}

function handleDragEnd() {
  endTableDrag()
}

/** Where the dragged row/column would land — a thin bar at the boundary
 * it's about to cross, on the side matching the move direction (matches
 * `moveRowAt`/`moveColumnAt`'s splice-at-target-index semantics). */
function getDropIndicatorStyle(
  drag: TableDragInfo | null,
  rowIndex: number,
  colIndex: number,
  tableRect: DOMRect,
  cellRect: DOMRect,
): CSSProperties | null {
  if (!drag) return null

  const currentIndex = drag.orientation === 'row' ? rowIndex : colIndex
  if (currentIndex === drag.fromIndex) return null

  const forward = currentIndex > drag.fromIndex
  const base: CSSProperties = {
    position: 'fixed',
    background: 'var(--color-primary)',
    borderRadius: DROP_LINE_THICKNESS / 2,
    pointerEvents: 'none',
  }

  if (drag.orientation === 'row') {
    return {
      ...base,
      left: tableRect.left,
      top: (forward ? cellRect.bottom : cellRect.top) - DROP_LINE_THICKNESS / 2,
      width: tableRect.width,
      height: DROP_LINE_THICKNESS,
    }
  }

  return {
    ...base,
    left: (forward ? cellRect.right : cellRect.left) - DROP_LINE_THICKNESS / 2,
    top: tableRect.top,
    width: DROP_LINE_THICKNESS,
    height: tableRect.height,
  }
}

interface HandleMenuItem {
  label: string
  disabled?: boolean
  onClick: () => void
}

interface HandleSubmenu {
  label: string
  items: HandleMenuItem[]
}

type HandleMenuEntry = HandleMenuItem | HandleSubmenu | 'separator'

function isSubmenu(entry: HandleMenuEntry): entry is HandleSubmenu {
  return typeof entry === 'object' && 'items' in entry
}

const ALIGN_OPTIONS: { label: string; align: TableAlign }[] = [
  { label: 'Left', align: 'left' },
  { label: 'Center', align: 'center' },
  { label: 'Right', align: 'right' },
  { label: 'None', align: null },
]

function HandleMenu({
  icon,
  ariaLabel,
  style,
  side,
  items,
  draggable,
  onDragStart,
}: {
  icon: ReactNode
  ariaLabel: string
  style: CSSProperties
  side: 'left' | 'bottom'
  items: HandleMenuEntry[]
  draggable?: boolean
  onDragStart?: (event: DragEvent) => void
}) {
  // Controlled (rather than left to the DropdownMenuTrigger's own
  // mousedown-driven open logic) so a confirmed drag can force it shut —
  // Base UI's trigger opens on mousedown, before it's known whether the
  // press will turn into a drag, so a real drag could otherwise leave the
  // menu open for the whole gesture.
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(TABLE_HANDLE_OVERLAY_CLASS, 'z-40')}
      style={style}
      draggable={draggable}
      onDragStart={(event) => {
        // Forcing the menu shut this way bypasses the library's own close
        // path, so its `onOpenChange(false)` never fires — unfreeze hover
        // tracking here too, or it stays frozen (no handles reappearing on
        // hover) for the rest of the session after the first drag.
        setOpen(false)
        setTableHandleFrozen(false)
        onDragStart?.(event)
      }}
      onDragEnd={handleDragEnd}
    >
      <DropdownMenu
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          setTableHandleFrozen(next)
        }}
      >
        <DropdownMenuTrigger
          aria-label={ariaLabel}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
            'h-full w-full text-muted-foreground',
            draggable && 'cursor-grab active:cursor-grabbing',
          )}
        >
          {icon}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={TABLE_HANDLE_OVERLAY_CLASS}
          side={side}
          align="center"
        >
          {items.map((item, index) => {
            if (item === 'separator') {
              return <DropdownMenuSeparator key={`separator-${index}`} />
            }

            if (isSubmenu(item)) {
              return (
                <DropdownMenuSub key={item.label}>
                  <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.items.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.label}
                        disabled={subItem.disabled}
                        onClick={subItem.onClick}
                      >
                        {subItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )
            }

            return (
              <DropdownMenuItem
                key={item.label}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.label}
              </DropdownMenuItem>
            )
          })}
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
    drag,
  } = state

  const rowHandleStyle: CSSProperties = {
    position: 'fixed',
    left: tableRect.left - HANDLE_SIZE - HANDLE_GAP,
    top: cellRect.top,
    width: HANDLE_SIZE,
    height: cellRect.height,
  }

  const colHandleStyle: CSSProperties = {
    position: 'fixed',
    left: cellRect.left,
    top: tableRect.top - HANDLE_SIZE - HANDLE_GAP,
    width: cellRect.width,
    height: HANDLE_SIZE,
  }

  const dropIndicatorStyle = getDropIndicatorStyle(
    drag,
    rowIndex,
    colIndex,
    tableRect,
    cellRect,
  )

  return createPortal(
    <>
      {dropIndicatorStyle && (
        <div
          className={cn(TABLE_HANDLE_OVERLAY_CLASS, 'z-30')}
          style={dropIndicatorStyle}
        />
      )}

      <HandleMenu
        icon={<EllipsisVertical className="size-3.5" />}
        ariaLabel="Row options"
        style={rowHandleStyle}
        side="left"
        draggable={!isHeaderRow}
        onDragStart={(event) =>
          handleDragStart(event, editor, 'row', tablePos, rowIndex)
        }
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
            label: 'Move row up',
            disabled: isHeaderRow || rowIndex <= 1,
            onClick: () =>
              editor.commands.moveRow(tablePos, rowIndex, rowIndex - 1),
          },
          {
            label: 'Move row down',
            disabled: isHeaderRow || rowIndex >= rowCount - 1,
            onClick: () =>
              editor.commands.moveRow(tablePos, rowIndex, rowIndex + 1),
          },
          'separator',
          {
            label: 'Duplicate row',
            onClick: () => editor.commands.duplicateRow(tablePos, rowIndex),
          },
          {
            label: 'Clear row contents',
            onClick: () => editor.commands.clearRow(tablePos, rowIndex),
          },
          {
            label: 'Delete row',
            disabled: isHeaderRow || rowCount <= 2,
            onClick: () => editor.commands.deleteRowAt(tablePos, rowIndex),
          },
        ]}
      />

      <HandleMenu
        icon={<Ellipsis className="size-3.5" />}
        ariaLabel="Column options"
        style={colHandleStyle}
        side="bottom"
        draggable={colCount > 1}
        onDragStart={(event) =>
          handleDragStart(event, editor, 'col', tablePos, colIndex)
        }
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
            label: 'Move column left',
            disabled: colIndex <= 0,
            onClick: () =>
              editor.commands.moveColumn(tablePos, colIndex, colIndex - 1),
          },
          {
            label: 'Move column right',
            disabled: colIndex >= colCount - 1,
            onClick: () =>
              editor.commands.moveColumn(tablePos, colIndex, colIndex + 1),
          },
          'separator',
          {
            label: 'Duplicate column',
            onClick: () => editor.commands.duplicateColumn(tablePos, colIndex),
          },
          {
            label: 'Clear column contents',
            onClick: () => editor.commands.clearColumn(tablePos, colIndex),
          },
          {
            label: 'Delete column',
            disabled: colCount <= 1,
            onClick: () => editor.commands.deleteColumnAt(tablePos, colIndex),
          },
          'separator',
          {
            label: 'Align',
            items: ALIGN_OPTIONS.map((option) => ({
              label: option.label,
              onClick: () =>
                editor.commands.setColumnAlignAt(
                  tablePos,
                  colIndex,
                  option.align,
                ),
            })),
          },
          {
            label: 'Sort ascending',
            onClick: () =>
              editor.commands.sortRowsByColumn(tablePos, colIndex, 'asc'),
          },
          {
            label: 'Sort descending',
            onClick: () =>
              editor.commands.sortRowsByColumn(tablePos, colIndex, 'desc'),
          },
        ]}
      />
    </>,
    document.body,
  )
}
