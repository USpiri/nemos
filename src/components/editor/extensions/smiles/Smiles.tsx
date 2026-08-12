import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { hiddenStyle, isInsideNode } from '@/lib/editor/utils'

const options = {
  themes: {
    variables: {
      C: 'var(--smiles-color-c)',
      O: 'var(--smiles-color-o)',
      N: 'var(--smiles-color-n)',
      F: 'var(--smiles-color-f)',
      CL: 'var(--smiles-color-cl)',
      BR: 'var(--smiles-color-br)',
      I: 'var(--smiles-color-i)',
      P: 'var(--smiles-color-p)',
      S: 'var(--smiles-color-s)',
      B: 'var(--smiles-color-b)',
      SI: 'var(--smiles-color-si)',
      H: 'var(--smiles-color-h)',
      BACKGROUND: 'var(--smiles-color-background)',
    },
  },
}

export const Smiles = ({ node, getPos, editor }: NodeViewProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const mountedRef = useRef(true)

  // whether the current selection is this node (fully selected, or the
  // cursor is somewhere inside its source text) — computed live rather than
  // trusted from the `selected` prop, since that prop updates asynchronously
  // relative to the `selectionUpdate` event below and would otherwise race it
  const isOwnSelection = () => {
    const pos = getPos()
    if (pos == undefined) return false
    const { from, to } = editor.state.selection
    return (
      (from <= pos && to >= pos + node.nodeSize) ||
      isInsideNode(from, to, pos, node.nodeSize)
    )
  }

  const [showSource, setShowSource] = useState(isOwnSelection)

  const onClick = () => {
    const pos = getPos()
    if (pos == undefined) return
    editor.chain().focus().setNodeSelection(pos).run()
  }

  useEffect(() => {
    const handleSelectionUpdate = () => setShowSource(isOwnSelection())
    // closing here only on an actual selection change (not on refocus) means
    // regaining app/window focus can't silently reopen Source mode off the
    // stale selection left over from before the blur
    const handleBlur = () => setShowSource(false)

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('blur', handleBlur)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('blur', handleBlur)
    }
  }, [editor, getPos, node])

  useEffect(() => {
    mountedRef.current = true
    if (!svgRef.current) return

    import('smiles-drawer').then((mod) => {
      if (!mountedRef.current || !svgRef.current) return
      const SmilesDrawer = mod.default
      const drawer = new SmilesDrawer.SvgDrawer(options)
      const smiles = SmilesDrawer.clean(node.textContent.trim())

      SmilesDrawer.parse(
        smiles,
        (tree: unknown) => {
          if (mountedRef.current && svgRef.current)
            drawer.draw(tree, svgRef.current, 'variables')
        },
        (err: unknown) => console.error(err),
      )
    })

    return () => {
      mountedRef.current = false
    }
  }, [node.textContent])

  return (
    <NodeViewWrapper className="smiles">
      <pre style={showSource ? undefined : hiddenStyle}>
        <NodeViewContent className="smiles-source language-smiles" />
      </pre>
      <div
        className="smiles-render select-none transition-all"
        onClick={onClick}
        contentEditable={false}
        role="button"
      >
        <svg ref={svgRef} />
      </div>
    </NodeViewWrapper>
  )
}
