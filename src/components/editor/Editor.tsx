import { DragHandle } from '@tiptap/extension-drag-handle-react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { GripVertical } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Extensions } from './extensions'

import './editor.css'
import './extensions/higlights.css'
// import './extensions/mermaid.css'

interface Props {
  content?: string
  className?: string
  cssClass?: string
  onUpdate?: (content: string) => void
  editable?: boolean
}

export const Editor = ({
  content,
  className,
  cssClass,
  onUpdate,
  editable = true,
}: Props) => {
  const editor = useEditor(
    {
      extensions: Extensions,
      content,
      injectCSS: false,
      autofocus: true,
      editable,
      editorProps: {
        attributes: {
          class: cn(
            'typography editor focus:outline-none relative',
            className,
            cssClass,
          ),
          spellcheck: 'false',
        },
        handleDrop: (_view, event) => {
          // check if the dropped item is a workspace tree node
          const uri = event.dataTransfer?.getData('text/uri-list')
          if (uri?.includes('/workspace/')) return true
          return false
        },
      },
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getMarkdown())
      },
      contentType: 'markdown',
    },
    [content],
  )

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  const providerValue = useMemo(() => ({ editor }), [editor])
  if (!editor) return null

  return (
    <>
      <EditorContext.Provider value={providerValue}>
        <DragHandle editor={editor}>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab text-muted-foreground"
          >
            <GripVertical className="size-4" />
          </Button>
        </DragHandle>
        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </>
  )
}
