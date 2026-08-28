import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useWorkspaceRegistry } from '@/lib/workspace'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const workspaceRoute = getRouteApi('/workspace/$rootPath')

export const WorkspaceSelector = () => {
  const { rootPath } = workspaceRoute.useParams()
  const workspaces = useWorkspaceRegistry((state) => state.workspaces)
  const navigate = useNavigate()

  const handleWorkspaceChange = (rootPath: string | null) => {
    if (!rootPath) return
    navigate({ to: '/workspace/$rootPath', params: { rootPath } })
  }

  return (
    <Select value={rootPath} onValueChange={handleWorkspaceChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="p-1">
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.path} value={workspace.path}>
            {workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
