import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, GripVertical } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 200

const alignButtons: {
  value: 'start' | 'end' | 'center'
  icon: React.ElementType
}[] = [
  { value: 'start', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'end', icon: AlignRight },
]

export default function ImageNodeView({
  node,
  editor,
  selected,
}: NodeViewProps) {
  const cleanUpRef = useRef<() => void>(null)

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const parent = event.currentTarget.parentElement
      if (!parent) return
      const image = parent.querySelector('img')
      if (!image) return

      const startSize = { x: image.clientWidth, y: image.clientHeight }
      const startPosition = { x: event.pageX, y: event.pageY }

      function onMouseMove(mouseMoveEvent: MouseEvent) {
        const newWidth = startSize.x - startPosition.x + mouseMoveEvent.pageX
        if (newWidth < MIN_WIDTH) return
        editor.commands.updateAttributes('image', {
          width: newWidth,
          height: startSize.y - startPosition.y + mouseMoveEvent.pageY,
        })
      }

      function cleanup() {
        document.body.removeEventListener('mousemove', onMouseMove)
        document.body.removeEventListener('mouseup', cleanup)
        cleanUpRef.current = null
      }

      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', cleanup, { once: true })
      cleanUpRef.current = cleanup
    },
    [editor],
  )

  useEffect(() => {
    return () => cleanUpRef.current?.()
  }, [])

  return (
    <NodeViewWrapper
      as="figure"
      style={{ textAlign: node.attrs.align }}
      className={cn('image-resizable', selected && 'has-focus')}
    >
      <img {...node.attrs} />
      <div className="image-resize-trigger" onMouseDown={handleMouseDown}>
        <GripVertical />
      </div>
      <div className="image-align-buttons">
        {alignButtons.map((e) => (
          <Button
            variant={e.value === node.attrs.align ? 'default' : 'outline'}
            data-align={e.value}
            data-selected={e.value === node.attrs.align}
            size="icon"
            key={e.value}
            onClick={() => editor.chain().setImageAlign(e.value).run()}
          >
            <e.icon />
          </Button>
        ))}
      </div>
    </NodeViewWrapper>
  )
}
