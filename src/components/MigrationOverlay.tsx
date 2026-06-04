import { FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Phase = 'prompt' | 'migrating'

interface Props {
  phase: Phase
  total: number
  done?: number
  onMigrate: () => void
  onMigrateAndDelete: () => void
}

export const MigrationOverlay = ({
  phase,
  total,
  done = 0,
  onMigrate,
  onMigrateAndDelete,
}: Props) => {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm space-y-5 rounded-xl border border-border bg-background p-6 shadow-lg">
        {phase === 'prompt' ? (
          <>
            <div className="space-y-1.5">
              <p className="font-semibold text-base">Legacy notes found</p>
              <p className="text-muted-foreground text-sm">
                {total} note{total !== 1 ? 's are' : ' is'} stored in the old
                format. Migrate them to Markdown to continue using them.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                size="lg"
                className="w-full justify-between"
                onClick={onMigrateAndDelete}
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="size-4" />
                  Migrate and delete old files
                </span>
                <span className="rounded bg-white/15 px-1.5 py-0.5 font-normal text-xs opacity-70">
                  Recommended
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-2"
                onClick={onMigrate}
              >
                <FileText className="size-4" />
                Migrate only
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <p className="font-semibold text-base">Migrating notes&hellip;</p>
              <p className="text-muted-foreground text-sm">
                Converting notes to Markdown format.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-foreground transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-right text-muted-foreground text-xs tabular-nums">
                {done} / {total}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
