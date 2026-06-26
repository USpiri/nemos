import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OverrideIndicator({ onRevert }: { onRevert: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
      <Button
        variant="ghost"
        size="icon"
        className="size-5 text-muted-foreground hover:text-foreground"
        title="Revert to global setting"
        onClick={onRevert}
      >
        <RotateCcw className="size-3" />
      </Button>
    </div>
  )
}
