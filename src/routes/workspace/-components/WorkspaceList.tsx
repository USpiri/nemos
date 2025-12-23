import { ArrowRightIcon, FolderIcon } from "lucide-react";
import { Link } from "@/components/ui/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type WorkspaceEntry } from "@/lib/workspace";
import { Code } from "@/components/ui/typography";

type Props = {
  workspaces: WorkspaceEntry[];
};

export const WorkspaceList = ({ workspaces }: Props) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {workspaces.map((workspace) => (
        <Card key={workspace.name} className="h-full">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderIcon className="text-muted-foreground size-4" />
              {workspace.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Stored in <Code>{workspace.path}</Code>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between">
            <CardDescription className="text-xs">
              Open to view notes
            </CardDescription>
            <Link
              to="/workspace/$workspaceId"
              params={{ workspaceId: workspace.name }}
              size="sm"
              variant="outline"
            >
              Open
              <ArrowRightIcon />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
