import { Node } from '@tiptap/pm/model'
import { NodeView } from '@tiptap/pm/view'
import { Editor, NodeViewRendererProps } from '@tiptap/react'
import katex from 'katex'

class MathNodeView implements NodeView {
  renderer!: HTMLElement
  content!: HTMLElement | null
  editor!: Editor
  node!: Node
  getPos!: () => number | undefined
  showSource!: boolean
  type: string
  isInline: boolean
  private handleClick: () => void
  private boundHandleSelectionUpdate: () => void

  constructor(props: NodeViewRendererProps, isInline = false) {
    this.editor = props.editor
    this.node = props.node
    this.getPos = props.getPos
    this.showSource = this.node.attrs.showSource
    this.type = isInline ? 'math-inline' : 'math-display'
    this.isInline = isInline
    this.handleClick = () => this.selectNode()
    this.boundHandleSelectionUpdate = this.handleSelectionUpdate.bind(this)
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
    katex.render(this.node.textContent, katexNode, {
      displayMode: !this.isInline,
      throwOnError: false,
    })
    dom.append(katexNode)

    // select the node on click
    dom.addEventListener('click', this.handleClick)

    dom.setAttribute('draggable', 'true')

    if (!this.showSource || !this.editor.isEditable) {
      source.setAttribute(
        'style',
        'opacity: 0; overflow: hidden; position: absolute; width: 0px; height: 0px;',
      )
    } else {
      dom.classList.add('math-selected')
      if (this.isInline)
        katexNode.setAttribute(
          'style',
          'opacity: 0; overflow: hidden; position: absolute; width: 0px; height: 0px;',
        )
    }

    this.editor.on('selectionUpdate', this.boundHandleSelectionUpdate)

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
    } else if (this.showSource) {
      this.deselectNode()
    }
  }

  selectNode() {
    const pos = this.getPos()
    if (pos == undefined) return
    // check the node at `pos` is a math node
    const nodeAfter = this.editor.state.tr.doc.resolve(pos).nodeAfter

    if (nodeAfter?.type.name != this.type && !this.showSource) return

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
    this.renderer.removeEventListener('click', this.handleClick)
    this.editor.off('selectionUpdate', this.boundHandleSelectionUpdate)
    this.content = null
  }

  stopEvent() {
    // when the node is selected, don't allow it to be dragged
    return !!this.renderer.getAttribute('draggable')
  }
}
export default MathNodeView
