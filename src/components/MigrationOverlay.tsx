import { FileText, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { migrateAllNotes } from '@/lib/migration'

interface Props {
  workspaceId: string
  legacyCount: number
}

export const MigrationOverlay = ({ workspaceId, legacyCount }: Props) => {
  const [phase, setPhase] = useState<'prompt' | 'migrating' | 'done'>(
    legacyCount > 0 ? 'prompt' : 'done',
  )
  const [progress, setProgress] = useState({ done: 0, total: legacyCount })

  const runMigration = (deleteAfter: boolean) => {
    setPhase('migrating')
    migrateAllNotes(workspaceId, {
      deleteAfter,
      onProgress: (done, total) => setProgress({ done, total }),
    })
      .then((result) => {
        if (result.failed.length > 0) {
          toast.warning(
            `${result.failed.length} note${result.failed.length > 1 ? 's' : ''} could not be migrated. Check the log for details.`,
          )
        }
      })
      .catch(() => {
        toast.error('Migration failed unexpectedly.')
      })
      .finally(() => {
        setPhase('done')
      })
  }

  if (phase === 'done') return null

  const pct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm space-y-5 rounded-xl border border-border bg-background p-6 shadow-lg">
        {phase === 'prompt' ? (
          <>
            <div className="space-y-1.5">
              <p className="font-semibold text-base">Legacy notes found</p>
              <p className="text-muted-foreground text-sm">
                {legacyCount} note{legacyCount !== 1 ? 's are' : ' is'} stored
                in the old format. Migrate them to Markdown to continue using
                them.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                size="lg"
                className="w-full justify-between"
                onClick={() => runMigration(true)}
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
                onClick={() => runMigration(false)}
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
                {progress.done} / {progress.total}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
