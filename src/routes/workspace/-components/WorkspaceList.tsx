import { type WorkspaceEntry } from '@/lib/workspace'
import { RootListRow } from './RootListRow'

type Props = {
  workspaces: WorkspaceEntry[]
}

export const WorkspaceList = ({ workspaces }: Props) => {
  return (
    <ul className="divide-y divide-border">
      {workspaces.map((workspace) => (
        <RootListRow
          key={workspace.path}
          path={workspace.path}
          name={workspace.name}
        />
      ))}
    </ul>
  )
}
