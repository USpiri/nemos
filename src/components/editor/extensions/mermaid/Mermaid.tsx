import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { hiddenStyle, isInsideNode } from '@/lib/editor/utils'
import { cn } from '@/lib/utils'
import { options } from './options'

let mermaidPromise: Promise<typeof import('mermaid')> | null = null

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      mod.default.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        ...options,
      })
      return mod
    })
  }
  return mermaidPromise
}

export const Mermaid = ({ node, getPos, editor }: NodeViewProps) => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const mermaidIdRef = useRef(`mermaid-${crypto.randomUUID()}`)
  const renderVersionRef = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const debouncedRender = useDebouncedCallback(async (source: string) => {
    const version = ++renderVersionRef.current

    if (!source || !renderRef.current) {
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { default: mermaid } = await loadMermaid()
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
      <pre style={showSource ? undefined : hiddenStyle}>
        <NodeViewContent className="mermaid-source" />
      </pre>
      <div
        className={cn(
          'mermaid-render select-none transition-all',
          error && 'h-0 opacity-0',
        )}
        onClick={onClick}
        contentEditable={false}
        role="button"
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
