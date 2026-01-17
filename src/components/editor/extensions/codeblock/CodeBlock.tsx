import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'
import { CopyButton } from '@/components/ui/copy-button'
import { LanguageSelector } from './LanguageSelector'

export const CodeBlock = ({ node, updateAttributes }: NodeViewProps) => {
  const handleLanguageChange = useCallback(
    (value: string) => {
      if (value === node.attrs.language) return
      updateAttributes({ language: value })
    },
    [updateAttributes, node.attrs.language],
  )

  return (
    <NodeViewWrapper className="codeblock relative w-full overflow-hidden">
      <pre>
        <NodeViewContent className={`language-${node.attrs.language}`} />
      </pre>
      <div className="absolute right-2 bottom-8 flex flex-row items-center gap-2">
        <CopyButton content={node.textContent} variant="ghost" tabIndex={-1} />
        <LanguageSelector
          value={node.attrs.language}
          onChange={handleLanguageChange}
        />
      </div>
    </NodeViewWrapper>
  )
}
