import { CheckIcon, DownloadIcon, XIcon } from 'lucide-react'
import { CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdate } from '@/hooks/use-update'
import { cn } from '@/lib/utils'
import { Editor } from './editor'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'

/**
 * Dialog that displays update information and allows users to download and install
 */
export const UpdateDialog = () => {
  const {
    updateInfo,
    progress,
    isDownloading,
    isDialogOpen,
    closeDialog,
    download,
    dismiss,
  } = useUpdate()

  if (!updateInfo) return null

  const handleInstall = async () => {
    await download()
  }

  const isDownloadComplete = progress.status === 'finished'
  const hasError = progress.status === 'error'

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">Update Available</span>
            <Badge className="rounded-md">v{updateInfo.version}</Badge>
          </DialogTitle>
          <DialogDescription>
            A new version of Nemos is available.
            {updateInfo.date && (
              <span className="mt-1 block text-xs">
                Released: {new Date(updateInfo.date).toLocaleDateString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Release Notes */}
        {updateInfo.body && (
          <div
            style={{ '--font-size-multiplier': '0.8' } as CSSProperties}
            className="bg-muted/50 rounded-lg border p-1"
          >
            <ScrollArea className="max-h-80 w-full p-4">
              <h4 className="mb-2 text-sm font-semibold">What's new:</h4>
              <Editor
                content={updateInfo.body}
                className="h-full w-full"
                editable={false}
              />
            </ScrollArea>
          </div>
        )}

        {/* Download Progress */}
        {isDownloading && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {progress.status === 'started' && 'Starting download...'}
                  {progress.status === 'progress' && 'Downloading...'}
                  {progress.status === 'finished' && 'Download complete'}
                  {progress.status === 'error' && 'Download failed'}
                </span>
                {progress.percentage > 0 && (
                  <span className="font-medium">{progress.percentage}%</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Progress
                  value={progress.percentage}
                  className={cn('h-2 w-full', hasError && 'bg-destructive')}
                />
                <Button variant="ghost" size="icon" onClick={() => dismiss()}>
                  <XIcon className="text-destructive" />
                </Button>
              </div>
            </div>
          </>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeDialog}
            disabled={isDownloading}
          >
            <XIcon />
            Dismiss
          </Button>
          <Button
            onClick={handleInstall}
            disabled={isDownloading || isDownloadComplete}
          >
            {isDownloadComplete ? (
              <>
                <CheckIcon />
                Downloaded
              </>
            ) : (
              <>
                <DownloadIcon />
                {isDownloading ? 'Downloading...' : 'Download & Install'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
