import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { Link as LinkComponent } from '@/components/ui/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Code, P } from '@/components/ui/typography'
import { toRelativePath } from '@/lib/paths'
import { DetailedWorkspaceEntry } from '@/lib/workspace'
import { getNoteRelativeDir } from '@/lib/workspace/utils'

type Props = {
  notes: DetailedWorkspaceEntry[]
  workspaceId: string
}

export const RecentNotesTable = ({ notes, workspaceId }: Props) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note.path}>
              <TableCell>
                <Link
                  to="/workspace/$workspaceId/notes/$noteId"
                  params={{
                    workspaceId,
                    noteId: toRelativePath(note.path),
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{note.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Code>{getNoteRelativeDir(note.path)}</Code>
              </TableCell>
              <TableCell>
                <P variant="muted" className="text-xs">
                  {note.modified?.toLocaleDateString()}
                </P>
              </TableCell>
              <TableCell className="text-right">
                <LinkComponent
                  to="/workspace/$workspaceId/notes/$noteId"
                  params={{ workspaceId, noteId: toRelativePath(note.path) }}
                  size="sm"
                  variant="ghost"
                >
                  Open
                </LinkComponent>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
