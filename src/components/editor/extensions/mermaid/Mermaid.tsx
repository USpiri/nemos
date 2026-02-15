import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { LoaderCircle } from 'lucide-react'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { hiddenStyle, isInsideNode } from '@/lib/editor/utils'
import { cn } from '@/lib/utils'

mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: 'default',
  securityLevel: 'strict',
})

export const Mermaid = ({ node, getPos, editor }: NodeViewProps) => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const mermaidIdRef = useRef(`mermaid-${crypto.randomUUID()}`)
  const renderVersionRef = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const debouncedRender = useDebouncedCallback(async (source: string) => {
    const version = ++renderVersionRef.current

    if (!source || !renderRef.current) {
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { svg } = await mermaid.render(
        `${mermaidIdRef.current}-${version}`,
        source,
      )
      if (renderVersionRef.current !== version || !renderRef.current) return
      renderRef.current.innerHTML = svg
    } catch (err) {
      if (renderVersionRef.current !== version) return
      setError(err instanceof Error ? err.message : 'Failed to render diagram')
      if (renderRef.current) renderRef.current.innerHTML = ''
    } finally {
      if (renderVersionRef.current === version) {
        setLoading(false)
      }
    }
  }, 300)

  // Re-render on content change
  useEffect(() => {
    const source = node.textContent.trim()
    debouncedRender(source)

    return () => {
      renderVersionRef.current++
      debouncedRender.cancel()
    }
  }, [node.textContent, debouncedRender])

  return (
    <NodeViewWrapper className="mermaid relative">
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
        <NodeViewContent className="mermaid-source" />
      </pre>
      <div
        className={cn(
          'mermaid-render select-none transition-all',
          error && 'h-0 opacity-0',
        )}
        contentEditable={false}
        ref={renderRef}
      />
      {error && !loading && (
        <pre className="mermaid-error" contentEditable={false}>
          {error}
        </pre>
      )}
      {loading && node.textContent.trim().length !== 0 && (
        <div className="mermaid-loading" contentEditable={false}>
          <LoaderCircle className="absolute top-2 right-2 size-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {!node.textContent.trim().length && (
        <div className="mermaid-empty" contentEditable={false}>
          Empty diagram
        </div>
      )}
    </NodeViewWrapper>
  )
}
