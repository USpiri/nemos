import { ArrowRightIcon, FolderIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from '@/components/ui/link'
import { Code } from '@/components/ui/typography'

type Props = {
  path: string
  name: ReactNode
  trailing?: ReactNode
}

export const RootListRow = ({ path, name, trailing }: Props) => {
  return (
    <li className="flex items-center gap-3 px-3 py-2.5">
      <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate font-medium text-sm">
          {name}
        </p>
        <p className="text-muted-foreground text-xs">
          <Code className="block truncate">{path}</Code>
        </p>
      </div>
      {trailing}
      <Link
        to="/workspace/$rootPath"
        params={{ rootPath: path }}
        size="sm"
        variant="outline"
        className="shrink-0"
      >
        Open
        <ArrowRightIcon />
      </Link>
    </li>
  )
}
