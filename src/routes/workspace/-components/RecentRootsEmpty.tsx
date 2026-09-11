import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export const RecentRootsEmpty = () => {
  return (
    <Empty className="max-h-96 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No recent folders</EmptyTitle>
        <EmptyDescription>
          Folders you open show up here, whether or not you pin them as a
          Workspace.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
