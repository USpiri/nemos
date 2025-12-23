import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNoteIdFromPath } from "@/lib/notes";
import { Link as LinkComponent } from "@/components/ui/link";
import { Link } from "@tanstack/react-router";
import { DetailedWorkspaceEntry } from "@/lib/workspace";
import { FileText } from "lucide-react";
import { Code, P } from "@/components/ui/typography";
import { getNoteRelativeDir } from "@/lib/workspace/utils";

type Props = {
  notes: DetailedWorkspaceEntry[];
  workspaceId: string;
};

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
                    noteId: getNoteIdFromPath(note.path),
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="text-muted-foreground size-4" />
                  <span className="text-sm font-medium">{note.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Code>{getNoteRelativeDir(note.path, workspaceId)}</Code>
              </TableCell>
              <TableCell>
                <P variant="muted" className="text-xs">
                  {note.modified?.toLocaleDateString()}
                </P>
              </TableCell>
              <TableCell className="text-right">
                <LinkComponent
                  to="/workspace/$workspaceId/notes/$noteId"
                  params={{ workspaceId, noteId: note.path }}
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
  );
};
