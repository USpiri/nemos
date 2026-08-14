import type { Editor } from '@tiptap/react'

const STYLE_PROPS = [
  'boxSizing',
  'backgroundColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRadius',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'color',
  'font',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'textDecoration',
  'textAlign',
  'verticalAlign',
  'whiteSpace',
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',
  'backgroundClip',
] as const

const toDash = (prop: string) =>
  prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Copies a curated list of computed styles source -> target, so a cloned
 * cell keeps looking like the real thing instead of picking up the drag
 * wrapper's own (unstyled) defaults. */
function copyComputedStyles(source: HTMLElement, target: HTMLElement) {
  const computed = getComputedStyle(source)

  for (const prop of STYLE_PROPS) {
    const value = computed.getPropertyValue(toDash(prop))
    if (value) target.style.setProperty(toDash(prop), value)
  }

  target.style.overflow = 'hidden'
  target.style.textOverflow = 'ellipsis'
  if (computed.whiteSpace === '' || computed.whiteSpace === 'normal') {
    target.style.whiteSpace = 'nowrap'
  }
}

/** Deep-clones a node, copying computed styles element-by-element — the
 * browser's own `cloneNode` copies markup but not resolved styles. */
function cloneWithStyles(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement

  const queue: Array<{ src: Element; dst: Element }> = [
    { src: root, dst: clone },
  ]
  while (queue.length) {
    const { src, dst } = queue.shift()!
    if (src instanceof HTMLElement && dst instanceof HTMLElement) {
      copyComputedStyles(src, dst)
    }
    const srcChildren = Array.from(src.children)
    const dstChildren = Array.from(dst.children)
    const len = Math.min(srcChildren.length, dstChildren.length)
    for (let i = 0; i < len; i += 1) {
      const srcChild = srcChildren[i]
      const dstChild = dstChildren[i]
      if (srcChild && dstChild) queue.push({ src: srcChild, dst: dstChild })
    }
  }

  return clone
}

function styleDragWrapper(el: HTMLElement, maxWidth: number) {
  Object.assign(el.style, {
    position: 'fixed',
    top: '-10000px',
    left: '-10000px',
    pointerEvents: 'none',
    zIndex: '2147483647',
    maxWidth: `${maxWidth}px`,
    borderRadius: '12px',
    background: 'transparent',
    filter:
      'drop-shadow(0 8px 24px rgba(0,0,0,0.18)) drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
    overflow: 'hidden',
  } as Partial<CSSStyleDeclaration>)
}

/** Scales the (already off-screen, attached) wrapper down if it exceeds
 * `maxWidth`, keeping layout crisp instead of letting the browser's native
 * drag-image scaling blur it. */
function scaleToFit(el: HTMLElement, maxWidth: number) {
  if (!el.isConnected) document.body.appendChild(el)
  const rect = el.getBoundingClientRect()
  if (rect.width > maxWidth && rect.width > 0) {
    const scale = maxWidth / rect.width
    el.style.transformOrigin = 'top left'
    el.style.transform = `scale(${scale})`
  }
}

function applyTableBoxStyles(
  srcTable: HTMLTableElement,
  dstTable: HTMLTableElement,
) {
  const computed = getComputedStyle(srcTable)
  dstTable.style.borderCollapse = computed.borderCollapse
  dstTable.style.borderSpacing = computed.borderSpacing
  dstTable.style.tableLayout = 'fixed'
  dstTable.className = srcTable.className
}

function lockCellWidth(fromCell: HTMLElement, toCell: HTMLElement) {
  const rect = fromCell.getBoundingClientRect()
  if (rect.width > 0) {
    toCell.style.width = `${rect.width}px`
    toCell.style.maxWidth = `${rect.width}px`
  }
}

function buildRowPreview(
  tableEl: HTMLTableElement,
  rowIndex: number,
): HTMLTableElement | null {
  // `tableEl.rows` (not `.tBodies[0].rows` / a `tbody` lookup): this table's
  // node view renders `<tr>`s directly under `<table>` via DOM APIs, not
  // via innerHTML parsing, so no `<tbody>` ever gets implicitly inserted —
  // `HTMLTableElement.rows` is the one row accessor that doesn't assume one.
  const row = tableEl.rows[rowIndex]
  if (!row) return null

  const tableClone = document.createElement('table')
  const tbodyClone = document.createElement('tbody')
  const rowClone = cloneWithStyles(row) as HTMLTableRowElement
  applyTableBoxStyles(tableEl, tableClone)

  for (let i = 0; i < row.cells.length; i += 1) {
    const src = row.cells[i]
    const dst = rowClone.cells[i]
    if (src && dst) lockCellWidth(src, dst)
  }

  tbodyClone.appendChild(rowClone)
  tableClone.appendChild(tbodyClone)
  return tableClone
}

function buildColumnPreview(
  tableEl: HTMLTableElement,
  colIndex: number,
): HTMLTableElement | null {
  const rows = tableEl.rows
  if (rows.length === 0) return null

  const tableClone = document.createElement('table')
  const tbodyClone = document.createElement('tbody')
  applyTableBoxStyles(tableEl, tableClone)

  let firstCellWidth = 0
  for (let r = 0; r < rows.length; r += 1) {
    const srcCell = rows[r]?.cells[colIndex]
    if (!srcCell) continue

    const tr = document.createElement('tr')
    const cellClone = cloneWithStyles(srcCell)
    const rect = srcCell.getBoundingClientRect()
    if (!firstCellWidth && rect.width > 0) firstCellWidth = rect.width
    lockCellWidth(srcCell, cellClone)

    tr.appendChild(cellClone)
    tbodyClone.appendChild(tr)
  }

  if (firstCellWidth > 0) {
    tableClone.style.width = `${firstCellWidth}px`
    tableClone.style.maxWidth = `${firstCellWidth}px`
  }

  tableClone.appendChild(tbodyClone)
  return tableClone
}

/**
 * Builds a drag image that looks like the actual dragged row/column — a
 * scaled, shadowed clone of its real cells — instead of the browser's
 * default screenshot of whatever DOM node initiated the drag (here, the
 * handle's floating wrapper div, which renders as a blank rectangle).
 */
export function createTableDragImage(
  editor: Editor,
  orientation: 'row' | 'col',
  index: number,
  tablePos: number,
): HTMLElement {
  const editorRect = editor.view.dom.getBoundingClientRect()
  const maxWidth = Math.max(0, editorRect.width)

  const wrapper = document.createElement('div')
  styleDragWrapper(wrapper, maxWidth)

  const tableDOM = editor.view.nodeDOM(tablePos)
  const tableEl =
    tableDOM instanceof HTMLElement
      ? (tableDOM.querySelector('table') ?? null)
      : null
  if (!(tableEl instanceof HTMLTableElement)) {
    document.body.appendChild(wrapper)
    return wrapper
  }

  const tableRect = tableEl.getBoundingClientRect()
  wrapper.style.width = `${Math.min(tableRect.width, editorRect.width)}px`

  const preview =
    orientation === 'row'
      ? buildRowPreview(tableEl, index)
      : buildColumnPreview(tableEl, index)

  if (preview) wrapper.appendChild(preview)

  scaleToFit(wrapper, maxWidth)

  return wrapper
}
