import { FileText } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const RecentNotesEmpty = () => {
  return (
    <Empty className="max-h-96 border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No notes yet</EmptyTitle>
        <EmptyDescription>
          Create a new note by clicking the "New Note" button above.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
