// PROTOTYPE for issue #81 — floating variant switcher, hidden in production builds.
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  variants: { key: string; label: string }[]
  current: string
  onCycle: (direction: 1 | -1) => void
}

export function PrototypeSwitcher({ variants, current, onCycle }: Props) {
  if (import.meta.env.PROD) return null

  const active = variants.find((v) => v.key === current)

  return (
    <div className="fixed bottom-4 left-1/2 z-100 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-dashed border-amber-500 bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur">
      <span className="pl-2 text-[0.65rem] font-semibold tracking-wide text-amber-600 uppercase">
        Prototype #81
      </span>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onCycle(-1)}
        aria-label="Previous variant"
      >
        <ChevronLeftIcon />
      </Button>
      <span className="min-w-40 px-1 text-center text-xs font-medium">
        {active?.key} — {active?.label}
      </span>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onCycle(1)}
        aria-label="Next variant"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
