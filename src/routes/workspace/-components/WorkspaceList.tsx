import { ArrowRightIcon, FolderIcon } from 'lucide-react'
import { Link } from '@/components/ui/link'
import { Code } from '@/components/ui/typography'
import { type WorkspacePin } from '@/lib/workspace'

type Props = {
  workspaces: WorkspacePin[]
}

export const WorkspaceList = ({ workspaces }: Props) => {
  return (
    <ul className="divide-y divide-border rounded-lg border">
      {workspaces.map((workspace) => (
        <li
          key={workspace.path}
          className="flex items-center gap-3 px-3 py-2.5"
        >
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">{workspace.name}</p>
            <p className="text-muted-foreground text-xs">
              <Code className="block truncate">{workspace.path}</Code>
            </p>
          </div>
          <Link
            to="/workspace/$rootPath"
            params={{ rootPath: workspace.path }}
            size="sm"
            variant="outline"
            className="shrink-0"
          >
            Open
            <ArrowRightIcon />
          </Link>
        </li>
      ))}
    </ul>
  )
}
