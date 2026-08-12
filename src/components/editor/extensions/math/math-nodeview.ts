import { Node } from '@tiptap/pm/model'
import { NodeView } from '@tiptap/pm/view'
import { Editor, NodeViewRendererProps } from '@tiptap/react'
import { render } from 'katex'

import 'katex/dist/katex.min.css'

class MathNodeView implements NodeView {
  renderer!: HTMLElement
  content!: HTMLElement | null
  editor!: Editor
  node!: Node
  getPos!: () => number | undefined
  showSource!: boolean
  type: string
  isInline: boolean
  private handleMouseDown: () => void
  private boundHandleSelectionUpdate: () => void
  private boundHandleBlur: () => void

  constructor(props: NodeViewRendererProps, isInline = false) {
    this.editor = props.editor
    this.node = props.node
    this.getPos = props.getPos
    this.showSource = this.node.attrs.showSource
    this.type = isInline ? 'math-inline' : 'math-display'
    this.isInline = isInline
    this.handleMouseDown = () => this.focusNode()
    this.boundHandleSelectionUpdate = this.handleSelectionUpdate.bind(this)
    this.boundHandleBlur = this.handleBlur.bind(this)
    this.mount()
  }

  mount() {
    const el = this.isInline ? 'span' : 'div'
    const dom = document.createElement(el)
    const source = document.createElement(el)
    const katexNode = document.createElement(el)

    source.textContent = this.node.textContent
    source.classList.add('math-content')

    if (!source.innerText.trim()) {
      source.classList.add('math-content-empty')
    }

    //append children
    dom.append(source)
    dom.classList.add('math', this.type)

    // render katex
    katexNode.setAttribute('contentEditable', 'false')
    render(this.node.textContent, katexNode, {
      displayMode: !this.isInline,
      throwOnError: false,
    })
    dom.append(katexNode)

    // open the node on click, and place the cursor inside it.
    // uses mousedown rather than click: in the embedded webview, the first
    // mousedown after the app/editor was unfocused re-establishes focus but
    // the follow-up synthetic click event is sometimes swallowed, so a
    // click listener here needs an extra click to ever fire
    dom.addEventListener('mousedown', this.handleMouseDown)

    if (!this.showSource || !this.editor.isEditable) {
      dom.setAttribute('draggable', 'true')
      source.setAttribute(
        'style',
        'opacity: 0; overflow: hidden; position: absolute; width: 0px; height: 0px;',
      )
    } else {
      dom.classList.add('math-selected')
      dom.addEventListener('dragstart', (e) => e.preventDefault())
      if (this.isInline)
        katexNode.setAttribute(
          'style',
          'opacity: 0; overflow: hidden; position: absolute; width: 0px; height: 0px;',
        )
    }

    this.editor.on('selectionUpdate', this.boundHandleSelectionUpdate)
    this.editor.on('blur', this.boundHandleBlur)

    this.renderer = dom
    this.content = source
  }

  get dom() {
    return this.renderer
  }

  get contentDOM() {
    return this.content
  }

  handleSelectionUpdate() {
    const pos = this.getPos()
    if (pos == undefined) return
    const { from, to } = this.editor.state.selection

    if (from >= pos && to <= pos + this.node.nodeSize) {
      // inside node
      if (!this.showSource) {
        this.selectNode()
      }
    } else {
      this.closeIfOpen()
    }
  }

  handleBlur() {
    this.closeIfOpen()
  }

  closeIfOpen() {
    if (this.showSource) this.deselectNode()
  }

  // resolve the node this view actually owns, guarding against a stale
  // getPos() after the doc has changed underneath this instance
  private resolveOwnNode() {
    const pos = this.getPos()
    if (pos == undefined) return undefined
    const nodeAfter = this.editor.state.tr.doc.resolve(pos).nodeAfter
    if (nodeAfter?.type.name != this.type) return undefined
    return pos
  }

  // open this node directly on click — don't rely on the selection actually
  // moving to trigger it via selectionUpdate. A native click on the
  // non-editable KaTeX render doesn't reliably relocate the browser's
  // selection (especially right after a blur, since the DOM selection can
  // survive the blur unchanged), so focus() alone can be a no-op. Moving
  // the selection afterwards is just for cursor placement; the previously
  // active node still closes itself through its own selectionUpdate handler
  // once the selection actually lands elsewhere.
  focusNode() {
    const pos = this.resolveOwnNode()
    if (pos == undefined) return

    if (!this.showSource) this.selectNode()

    this.editor
      .chain()
      .focus(pos + 1)
      .run()
  }

  selectNode() {
    const pos = this.showSource ? this.getPos() : this.resolveOwnNode()
    if (pos == undefined) return

    this.editor
      .chain()
      .command(({ tr }) => {
        tr.setNodeAttribute(pos, 'showSource', true)
        return true
      })
      .run()
  }

  deselectNode() {
    const pos = this.getPos()
    if (pos === undefined) return

    // If no content, delete node
    if (!this.node.textContent.trim()) {
      return this.editor.commands.command(({ tr }) => {
        tr.delete(pos, pos + this.node.nodeSize)
        return true
      })
    }

    // hide source
    this.editor.commands.command(({ tr }) => {
      tr.setNodeAttribute(pos, 'showSource', false)
      return true
    })
  }

  update() {
    return false
  }

  destroy() {
    this.renderer.removeEventListener('mousedown', this.handleMouseDown)
    this.editor.off('selectionUpdate', this.boundHandleSelectionUpdate)
    this.editor.off('blur', this.boundHandleBlur)
    this.content = null
  }

  stopEvent() {
    // when the node is selected, don't allow it to be dragged
    return !!this.renderer.getAttribute('draggable')
  }
}
export default MathNodeView
