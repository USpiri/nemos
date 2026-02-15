import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect, useRef } from 'react'
import { hiddenStyle, isInsideNode } from '@/lib/editor/utils'

// TODO: Add theme support
export const Smiles = ({ node, getPos, editor, selected }: NodeViewProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const mountedRef = useRef(true)

  const onClick = () => {
    const pos = getPos()
    if (pos == undefined) return
    editor.chain().focus().setNodeSelection(pos).run()
  }

  useEffect(() => {
    mountedRef.current = true
    if (!svgRef.current) return

    import('smiles-drawer').then((mod) => {
      if (!mountedRef.current || !svgRef.current) return
      const SmilesDrawer = mod.default
      const drawer = new SmilesDrawer.SvgDrawer({})
      const smiles = SmilesDrawer.clean(node.textContent.trim())

      SmilesDrawer.parse(
        smiles,
        (tree: unknown) => {
          if (mountedRef.current && svgRef.current)
            drawer.draw(tree, svgRef.current, 'dark')
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
      <pre
        style={
          !selected &&
          !isInsideNode(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos() ?? 0,
            node.nodeSize,
          )
            ? hiddenStyle
            : undefined
        }
      >
        <NodeViewContent className="smiles-source language-smiles" />
      </pre>
      <div
        className="smiles-render select-none transition-all"
        onClick={onClick}
        contentEditable={false}
      >
        <svg ref={svgRef} />
      </div>
    </NodeViewWrapper>
  )
}
