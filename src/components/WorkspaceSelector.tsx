import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PinIcon } from 'lucide-react'
import { rootFolderName } from '@/lib/paths'
import {
  findPinnedWorkspace,
  useRecentRoots,
  useWorkspaceRegistry,
} from '@/lib/workspace'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const workspaceRoute = getRouteApi('/workspace/$rootPath')

// The same Root path can be both a pinned Workspace and a Recent entry at
// once. Select component can't have two items sharing one `value` — it
// registers both as "selected" and the trigger ends up rendering both
// labels concatenated — so each group's items are namespaced by prefix
// and un-prefixed back to a path on change.
const WORKSPACE_PREFIX = 'workspace:'
const RECENT_PREFIX = 'recent:'

const toPath = (value: string): string =>
  value.startsWith(WORKSPACE_PREFIX)
    ? value.slice(WORKSPACE_PREFIX.length)
    : value.startsWith(RECENT_PREFIX)
      ? value.slice(RECENT_PREFIX.length)
      : value

export const WorkspaceSelector = () => {
  const { rootPath } = workspaceRoute.useParams()
  const workspaces = useWorkspaceRegistry((state) => state.workspaces)
  const recents = useRecentRoots((state) => state.recents)
  const navigate = useNavigate()

  const handleWorkspaceChange = (value: string | null) => {
    if (!value) return
    navigate({
      to: '/workspace/$rootPath',
      params: { rootPath: toPath(value) },
    })
  }

  const isPinned = workspaces.some((workspace) => workspace.path === rootPath)
  const isRecent = recents.some((recent) => recent.path === rootPath)

  // Prefer the Workspace entry as the trigger's selected item when the
  // current Root is both pinned and Recent, since its name is user-chosen.
  const selectedValue = isPinned
    ? `${WORKSPACE_PREFIX}${rootPath}`
    : isRecent
      ? `${RECENT_PREFIX}${rootPath}`
      : rootPath

  return (
    <Select value={selectedValue} onValueChange={handleWorkspaceChange}>
      <SelectTrigger className="w-full">
        <SelectValue className="min-w-0 truncate" />
      </SelectTrigger>
      <SelectContent className="p-1">
        <SelectGroup>
          <SelectLabel>Workspaces</SelectLabel>
          {workspaces.length ? (
            workspaces.map((workspace) => (
              <SelectItem
                key={workspace.path}
                value={`${WORKSPACE_PREFIX}${workspace.path}`}
              >
                {workspace.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="__no-workspaces__" disabled>
              No workspaces yet
            </SelectItem>
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Recent</SelectLabel>
          {recents.length ? (
            recents.map((recent) => {
              const pin = findPinnedWorkspace(workspaces, recent.path)

              return (
                <SelectItem
                  key={recent.path}
                  value={`${RECENT_PREFIX}${recent.path}`}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    {pin && <PinIcon className="size-3 shrink-0" />}
                    <span className="truncate">
                      {pin?.name ?? rootFolderName(recent.path)}
                    </span>
                  </span>
                </SelectItem>
              )
            })
          ) : (
            <SelectItem value="__no-recents__" disabled>
              No recent folders
            </SelectItem>
          )}
        </SelectGroup>
        {!isPinned && !isRecent && (
          <SelectItem value={rootPath}>
            {rootFolderName(rootPath)} (unpinned)
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
