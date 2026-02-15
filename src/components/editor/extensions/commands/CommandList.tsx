import { Editor, Range } from '@tiptap/react'
import { memo, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { CommandItem } from '@/types'

interface Props {
  items: CommandItem[]
  editor: Editor
  range: Range
}

export const CommandList = memo(({ items, editor, range }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const handleCommand = (item: CommandItem) => {
    item.command?.({ editor, range })
  }

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape']
    const onKeyDown = (e: KeyboardEvent) => {
      if (!navigationKeys.includes(e.key)) return
      if (e.key === 'Escape')
        return document.removeEventListener('keydown', onKeyDown, true)

      e.preventDefault()

      const key = e.key

      if (key === 'Enter') {
        items[selectedIndex].command?.({ editor, range })
      } else {
        setSelectedIndex((index) => {
          const next = index + (key === 'ArrowUp' ? -1 : 1)
          if (next === items.length) return 0
          if (next === -1) return items.length - 1
          return next
        })
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [selectedIndex, items, editor, range])

  useEffect(() => {
    if (listRef.current) {
      const selectedButton = listRef.current.querySelector<HTMLButtonElement>(
        `[data-index="${selectedIndex}"]`,
      )
      selectedButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  return (
    <Card className="rounded-sm py-0">
      <ScrollArea className="py-2">
        <CardContent className="max-h-72 w-52 p-0" ref={listRef}>
          {items.map((item, index) => (
            <Button
              key={item.title}
              variant="ghost"
              className={cn(
                'w-full justify-start rounded-none dark:hover:bg-muted',
                selectedIndex === index && 'bg-muted hover:text-foreground',
              )}
              data-index={index}
              onClick={() => handleCommand(item)}
            >
              {item.icon && <item.icon className="size-4" />}
              <span>{item.title}</span>
            </Button>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  )
})
