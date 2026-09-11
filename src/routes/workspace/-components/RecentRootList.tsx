import { ClockIcon, PinIcon } from 'lucide-react'
import { rootFolderName } from '@/lib/paths'
import {
  findPinnedWorkspace,
  type RecentRoot,
  useWorkspaceRegistry,
} from '@/lib/workspace'
import { RootListRow } from './RootListRow'

type Props = {
  recents: RecentRoot[]
}

export const RecentRootList = ({ recents }: Props) => {
  const workspaces = useWorkspaceRegistry((state) => state.workspaces)

  return (
    <ul className="divide-y divide-border rounded-lg">
      {recents.map((recent) => {
        const pin = findPinnedWorkspace(workspaces, recent.path)

        return (
          <RootListRow
            key={recent.path}
            path={recent.path}
            name={
              <>
                {pin && (
                  <PinIcon className="size-3 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">
                  {pin?.name ?? rootFolderName(recent.path)}
                </span>
              </>
            }
            trailing={
              <span className="flex shrink-0 items-center gap-1 text-muted-foreground text-xs">
                <ClockIcon className="size-3" />
                {new Date(recent.lastOpenedAt).toLocaleDateString()}
              </span>
            }
          />
        )
      })}
    </ul>
  )
}
