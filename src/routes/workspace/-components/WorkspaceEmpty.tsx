import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Code } from '@/components/ui/typography'
import { ROOT } from '@/config/constants'

type Props = {
  onRefresh?: () => void
}

export const WorkspaceEmpty = ({ onRefresh }: Props) => {
  return (
    <Empty className="max-h-96 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No workspaces yet</EmptyTitle>
        <EmptyDescription>
          Create a folder inside <Code>{ROOT}</Code>. Or you can create a new
          workspace folder by clicking the button below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex flex-row justify-center gap-2">
        <Button onClick={onRefresh}>Refresh list</Button>
        or
        <Button variant="outline">Create a new workspace</Button>
      </EmptyContent>
    </Empty>
  )
}
