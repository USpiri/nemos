import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect, useMemo, useRef } from 'react'
import SmilesDrawer from 'smiles-drawer'
import { hiddenStyle, isInsideNode } from '@/lib/editor/utils'

// TODO: Add theme support
export const Smiles = ({ node, getPos, editor }: NodeViewProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const drawer = useMemo(() => new SmilesDrawer.SvgDrawer({}), [])

  useEffect(() => {
    if (!svgRef.current) return
    const smiles = SmilesDrawer.clean(node.textContent.trim())

    SmilesDrawer.parse(
      smiles,
      (tree: unknown) => drawer.draw(tree, svgRef.current, 'dark'),
      (err: unknown) => console.error(err),
    )
  }, [node.textContent, drawer])

  return (
    <NodeViewWrapper className="smiles">
      <pre
        style={
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
        className="smiles-render transition-all select-none"
        contentEditable={false}
      >
        <svg ref={svgRef} />
      </div>
    </NodeViewWrapper>
  )
}
