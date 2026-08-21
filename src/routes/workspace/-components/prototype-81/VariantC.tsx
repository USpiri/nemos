// PROTOTYPE for issue #81 — Variant C: the most radical option. Switching
// moves out of a dropdown entirely into a persistent left rail (replaces
// WorkspaceSelector), with Pinned/Recent as rail sections and "+" as the
// Open Folder / Create Workspace entry point. This index page becomes a
// welcome/empty state since the rail now does the switching.
import {
  AlertTriangleIcon,
  ClockIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  PinIcon,
  PlusIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import { Code } from '@/components/ui/typography'
import { MissingRootDialog } from './MissingRootDialog'
import {
  basename,
  mockRecentRoots,
  mockWorkspaces,
  type MockWorkspace,
} from './mock-data'
import { PrototypeCreateWorkspaceDialog } from './PrototypeCreateWorkspaceDialog'

// A separate open-but-unpinned Root, to illustrate the "Pin this Workspace"
// affordance distinctly from the already-pinned rows below.
const CURRENT_UNPINNED_ROOT =
  'C:\\Users\\marc\\Documents\\nemos-app\\draft-ideas'

export function VariantC() {
  const [createOpen, setCreateOpen] = useState(false)
  const [missingTarget, setMissingTarget] = useState<MockWorkspace | null>(
    null,
  )

  const handleOpenFolder = () => {
    toast.info('Would open a native folder picker', {
      description: 'Opens unpinned by default — pin it from the rail after.',
    })
  }

  return (
    <div className="flex min-h-screen">
      <aside className="bg-muted/30 flex w-64 shrink-0 flex-col border-r">
        <div className="flex items-center justify-between p-3">
          <span className="text-sm font-semibold">Nemos</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Add"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
            >
              <PlusIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpenFolder}>
                <FolderOpenIcon /> Open Folder…
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <FolderPlusIcon /> Create Workspace…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mx-3 mb-2 rounded-md border border-dashed p-2">
          <p className="text-muted-foreground text-[0.65rem] font-medium tracking-wide uppercase">
            Current Root (unpinned)
          </p>
          <p className="truncate text-xs font-medium">
            {basename(CURRENT_UNPINNED_ROOT)}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-1.5 w-full"
            onClick={() =>
              toast('Pinned', {
                description: `"${basename(CURRENT_UNPINNED_ROOT)}" added to Workspaces.`,
              })
            }
          >
            <PinIcon /> Pin this Workspace
          </Button>
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-muted-foreground px-1.5 py-1 text-xs font-medium">
            Workspaces
          </p>
          {mockWorkspaces.map((w) => (
            <ContextMenu key={w.path}>
              <ContextMenuTrigger>
                <button
                  type="button"
                  onClick={() => w.missing && setMissingTarget(w)}
                  className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                >
                  <FolderIcon className="text-muted-foreground size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                  {w.missing && (
                    <Badge variant="destructive" className="shrink-0">
                      <AlertTriangleIcon />
                    </Badge>
                  )}
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    toast('Renamed (would open inline edit)', {
                      description: w.name,
                    })
                  }
                >
                  Rename
                </ContextMenuItem>
                {w.missing ? (
                  <ContextMenuItem onClick={() => setMissingTarget(w)}>
                    Resolve…
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem
                    onClick={() =>
                      toast('Unpinned', { description: w.name })
                    }
                  >
                    Unpin
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}

          <p className="text-muted-foreground mt-3 px-1.5 py-1 text-xs font-medium">
            Recent
          </p>
          {mockRecentRoots.map((r) => (
            <ContextMenu key={r.path}>
              <ContextMenuTrigger>
                <button
                  type="button"
                  className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                >
                  <ClockIcon className="text-muted-foreground size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">
                    {basename(r.path)}
                  </span>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    toast('Pinned', { description: basename(r.path) })
                  }
                >
                  <PinIcon /> Pin as Workspace
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-10">
        <Empty className="max-w-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>Select a Root</EmptyTitle>
            <EmptyDescription>
              Pick a Workspace or a Recent folder from the sidebar, or open a
              new folder to get started. Nothing here needs to be pinned to
              be opened.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleOpenFolder}>
                <FolderOpenIcon /> Open Folder
              </Button>
              <Button onClick={() => setCreateOpen(true)}>
                <FolderPlusIcon /> Create Workspace
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </main>

      <p className="fixed top-2 left-72 max-w-md text-xs text-muted-foreground">
        The sidebar switcher (<Code>WorkspaceSelector.tsx</Code>) would be
        replaced entirely by this rail in this variant.
      </p>

      <PrototypeCreateWorkspaceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <MissingRootDialog
        workspace={missingTarget}
        open={!!missingTarget}
        onOpenChange={(open) => !open && setMissingTarget(null)}
      />
    </div>
  )
}
