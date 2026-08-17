import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
import { CopyButton } from '@/components/ui/copy-button'
import { LanguageSelector } from './LanguageSelector'

export const CodeBlock = ({
  node,
  updateAttributes,
  editor,
}: NodeViewProps) => {
  const [isEditable, setIsEditable] = useState(editor.isEditable)

  useEffect(() => {
    const handleUpdate = () => setIsEditable(editor.isEditable)
    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  const handleLanguageChange = useCallback(
    (value: string) => {
      // unreachable while the selector below stays gated on isEditable,
      // kept as a second guard so a change to that render condition can't
      // alone reopen the read-only mutation path
      if (!isEditable) return
      if (value === node.attrs.language) return
      updateAttributes({ language: value })
    },
    [isEditable, updateAttributes, node.attrs.language],
  )

  return (
    <NodeViewWrapper className="codeblock group relative w-full overflow-hidden">
      <pre>
        <NodeViewContent className={`language-${node.attrs.language}`} />
      </pre>
      <div className="absolute top-9 right-2 flex flex-row items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton content={node.textContent} variant="ghost" tabIndex={-1} />
        {isEditable && (
          <LanguageSelector
            value={node.attrs.language}
            onChange={handleLanguageChange}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}
