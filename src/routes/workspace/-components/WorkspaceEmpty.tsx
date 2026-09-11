import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { useDialog } from '@/hooks/use-dialog'

export const WorkspaceEmpty = () => {
  const { open } = useDialog()

  return (
    <Empty className="max-h-96 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No workspaces yet</EmptyTitle>
        <EmptyDescription>
          Workspaces are folders you've pinned for quick access — they can live
          anywhere on disk, not just in one dedicated folder.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={() => open('add-workspace')}>
          Add Workspace
        </Button>
      </EmptyContent>
    </Empty>
  )
}
