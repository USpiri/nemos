// PROTOTYPE for issue #81 — Variant B: today's card grid, evolved, plus a
// separate Recent table below it. Pin toggle lives on the card. Missing-pin
// resolution is handled inline on the card itself (no modal) — an
// alternative to Variant A's dialog, for reaction.
import {
  ArrowRightIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  PinIcon,
  PinOffIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@/components/ui/editable-text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Code, H1, H2, P } from '@/components/ui/typography'
import {
  basename,
  CURRENT_ROOT_PATH,
  formatRelativeTime,
  mockRecentRoots,
  mockWorkspaces,
} from './mock-data'
import { PrototypeCreateWorkspaceDialog } from './PrototypeCreateWorkspaceDialog'

export function VariantB() {
  const [createOpen, setCreateOpen] = useState(false)
  const [resolvedMissing, setResolvedMissing] = useState<string | null>(null)

  const handleOpenFolder = () => {
    toast.info('Would open a native folder picker', {
      description: 'Opens unpinned by default — pin it from the row after.',
    })
  }

  const handleRename = (name: string, path: string) => {
    toast('Renamed', { description: `"${path}" is now labeled "${name}".` })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-10 py-24">
      <header className="flex max-w-2xl flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <H1 size="sm">Your workspaces</H1>
          <P variant="muted" size="sm">
            Pinned Roots for quick access. Open any folder without pinning it
            — it shows up under Recent instead.
          </P>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleOpenFolder}>
            <FolderOpenIcon /> Open Folder
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <FolderPlusIcon /> Create Workspace
          </Button>
        </div>
      </header>

      <section className="space-y-3">
        <H2>Workspaces</H2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockWorkspaces.map((workspace) => {
            const isResolved = resolvedMissing === workspace.path
            const isMissing = workspace.missing && !isResolved

            return (
              <Card
                key={workspace.path}
                className={isMissing ? 'border-destructive/50 border-dashed' : 'h-full'}
              >
                <CardHeader className="gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderIcon className="text-muted-foreground size-4" />
                    <Editable
                      defaultValue={workspace.name}
                      onSubmit={(name) => handleRename(name, workspace.path)}
                      className="flex-1"
                    >
                      <EditablePreview className="px-0 py-0" />
                      <EditableInput className="px-0 py-0" />
                    </Editable>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Unpin"
                      onClick={() =>
                        toast('Unpinned', {
                          description: `"${workspace.name}" removed from Workspaces.`,
                        })
                      }
                    >
                      <PinOffIcon />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isMissing ? (
                      <span className="text-destructive">
                        Not found at <Code>{workspace.path}</Code>
                      </span>
                    ) : (
                      <>
                        Stored in <Code>{workspace.path}</Code>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  {isMissing ? (
                    <div className="flex w-full gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() =>
                          toast.info('Would re-check the same path')
                        }
                      >
                        Retry
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setResolvedMissing(workspace.path)}
                      >
                        Relocate…
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() =>
                          toast('Pin deleted', {
                            description: `"${workspace.name}" removed.`,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardDescription className="text-xs">
                        Open to view notes
                      </CardDescription>
                      <Button size="sm" variant="outline">
                        Open
                        <ArrowRightIcon />
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <H2>Recent</H2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folder</TableHead>
              <TableHead>Last opened</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecentRoots.map((root) => (
              <TableRow key={root.path}>
                <TableCell>
                  <div className="font-medium">{basename(root.path)}</div>
                  <div className="text-muted-foreground text-xs">
                    <Code>{root.path}</Code>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatRelativeTime(root.lastOpenedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost">
                      Open
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Pin as Workspace"
                      onClick={() =>
                        toast('Pinned', {
                          description: `"${basename(root.path)}" added to Workspaces.`,
                        })
                      }
                    >
                      <PinIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <div className="bg-muted/40 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Preview — sidebar switcher (inside an open Root)
        </p>
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
      </div>

      <PrototypeCreateWorkspaceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}
