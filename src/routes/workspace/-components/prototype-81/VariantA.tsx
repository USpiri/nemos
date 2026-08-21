// PROTOTYPE for issue #81 — Variant A: a single list, toggled between
// Workspaces (pinned) and Recent via two tabs — kept separate rather than
// merged. Primary affordance is the list itself; pin/unpin and missing-root
// resolution are inline row actions. Sidebar switcher becomes a grouped
// Select. Picked on 2026-08-20, with these two tweaks applied live.
import {
  AlertTriangleIcon,
  ClockIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  PinIcon,
  PinOffIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Code, H1, P } from '@/components/ui/typography'
import { MissingRootDialog } from './MissingRootDialog'
import {
  basename,
  CURRENT_ROOT_PATH,
  formatRelativeTime,
  mockRecentRoots,
  mockWorkspaces,
  type MockWorkspace,
} from './mock-data'
import { PrototypeCreateWorkspaceDialog } from './PrototypeCreateWorkspaceDialog'

type Row = {
  key: string
  name: string
  path: string
  pinned: boolean
  missing?: boolean
  lastOpenedAt?: string
}

type Filter = 'pinned' | 'recent'

export function VariantA() {
  const [filter, setFilter] = useState<Filter>('pinned')
  const [createOpen, setCreateOpen] = useState(false)
  const [missingTarget, setMissingTarget] = useState<MockWorkspace | null>(
    null,
  )

  const rows: Row[] = [
    ...mockWorkspaces.map((w) => ({
      key: w.path,
      name: w.name,
      path: w.path,
      pinned: true,
      missing: w.missing,
    })),
    ...mockRecentRoots.map((r) => ({
      key: r.path,
      name: basename(r.path),
      path: r.path,
      pinned: false,
      lastOpenedAt: r.lastOpenedAt,
    })),
  ]

  const visible = rows.filter((r) =>
    filter === 'pinned' ? r.pinned : !r.pinned,
  )

  const handleOpenFolder = () => {
    toast.info('Would open a native folder picker', {
      description: 'Opens unpinned by default — pin it from the row after.',
    })
  }

  const handlePinToggle = (row: Row) => {
    toast(row.pinned ? 'Unpinned' : 'Pinned', {
      description: row.pinned
        ? `"${row.name}" removed from Workspaces. Still reachable from Recent.`
        : `"${row.name}" added to Workspaces, defaulting to "${basename(row.path)}".`,
    })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-10 py-24">
      <header className="max-w-2xl space-y-6">
        <H1 size="sm">Get started</H1>
        <P variant="muted" size="sm">
          Jump back into a pinned Workspace, reopen something recent, or open
          a new folder to start writing.
        </P>
      </header>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleOpenFolder}>
          <FolderOpenIcon /> Open Folder
        </Button>
        <Button onClick={() => setCreateOpen(true)}>
          <FolderPlusIcon /> Create Workspace
        </Button>
      </div>

      <div className="flex gap-1">
        {(
          [
            { key: 'pinned', label: 'Workspaces' },
            { key: 'recent', label: 'Recent' },
          ] as const
        ).map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? 'secondary' : 'ghost'}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <ul className="divide-border divide-y rounded-lg border">
        {visible.map((row) => (
          <li
            key={row.key}
            className="group flex items-center gap-3 px-3 py-2.5"
          >
            <FolderIcon className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {row.name}
                </span>
                {row.missing && (
                  <Badge variant="destructive">
                    <AlertTriangleIcon /> Not found
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground truncate text-xs">
                <Code>{row.path}</Code>
              </p>
            </div>
            {row.lastOpenedAt && (
              <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                <ClockIcon className="size-3" />
                {formatRelativeTime(row.lastOpenedAt)}
              </span>
            )}
            {row.missing ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  setMissingTarget({
                    name: row.name,
                    path: row.path,
                    missing: true,
                  })
                }
              >
                Resolve…
              </Button>
            ) : (
              <Button
                size="icon-sm"
                variant="ghost"
                className="shrink-0 opacity-0 group-hover:opacity-100"
                aria-label={row.pinned ? 'Unpin' : 'Pin'}
                onClick={() => handlePinToggle(row)}
              >
                {row.pinned ? <PinOffIcon /> : <PinIcon />}
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="bg-muted/40 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Preview — sidebar switcher (inside an open Root)
        </p>
        <div className="flex items-center gap-2">
          <Select defaultValue={CURRENT_ROOT_PATH}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workspaces</SelectLabel>
                {mockWorkspaces
                  .filter((w) => !w.missing)
                  .map((w) => (
                    <SelectItem key={w.path} value={w.path}>
                      {w.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Recent</SelectLabel>
                {mockRecentRoots.map((r) => (
                  <SelectItem key={r.path} value={r.path}>
                    {basename(r.path)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <PinIcon /> Pin this Workspace
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          The current Root (&ldquo;Personal Notes&rdquo;) is already pinned,
          so this button would read &ldquo;Unpin&rdquo; here — shown for an
          unpinned Root for illustration.
        </p>
      </div>

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
