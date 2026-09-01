import { ArrowRightIcon, ClockIcon, FolderIcon } from 'lucide-react'
import { Link } from '@/components/ui/link'
import { Code } from '@/components/ui/typography'
import { rootFolderName } from '@/lib/paths'
import { type RecentRoot } from '@/lib/workspace'

type Props = {
  recents: RecentRoot[]
}

export const RecentRootList = ({ recents }: Props) => {
  return (
    <ul className="divide-y divide-border rounded-lg">
      {recents.map((recent) => (
        <li key={recent.path} className="flex items-center gap-3 px-3 py-2.5">
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">
              {rootFolderName(recent.path)}
            </p>
            <p className="text-muted-foreground text-xs">
              <Code className="block truncate">{recent.path}</Code>
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground text-xs">
            <ClockIcon className="size-3" />
            {new Date(recent.lastOpenedAt).toLocaleDateString()}
          </span>
          <Link
            to="/workspace/$rootPath"
            params={{ rootPath: recent.path }}
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
