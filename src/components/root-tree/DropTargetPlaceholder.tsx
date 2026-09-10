import { ChevronRight, FileText } from 'lucide-react'
import { Button } from '../ui/button'

export const DropTargetPlaceholder = ({
  text,
  droppable,
  depth,
}: {
  text: string
  droppable: boolean
  depth: number
}) => {
  return (
    <Button
      className="w-full justify-start rounded-none text-muted-foreground opacity-50"
      variant="secondary"
      style={{ paddingInlineStart: depth * 10 + 8 }}
    >
      {droppable ? <ChevronRight /> : <FileText />} {text}
    </Button>
  )
}
