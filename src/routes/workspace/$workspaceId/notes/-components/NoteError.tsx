import { ErrorComponentProps, getRouteApi } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@/components/ui/link'
import { Code } from '@/components/ui/typography'
import { useDialog } from '@/hooks/use-dialog'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import { getNoteNameFromPath, NoteError as NoteErrorClass } from '@/lib/notes'

const route = getRouteApi('/workspace/$workspaceId/notes/$noteId')

export const NoteError = ({ error, reset }: ErrorComponentProps) => {
  return (
    <main className="flex h-full items-center justify-center p-6">
      <NoteErrorSwitch error={error} reset={reset} />
    </main>
  )
}

const NoteErrorSwitch = ({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) => {
  const { workspaceId, noteId } = route.useParams()
  const { deleteNoteAndRefresh } = useWorkspaceActions({
    workspace: workspaceId,
  })

  if (error instanceof NoteErrorClass) {
    switch (error.code) {
      case 'NOT_FOUND':
        return (
          <ErrorContent
            title="Note not found"
            description="The note you're looking for doesn't exist. It may have been deleted or renamed."
          >
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/workspace/$workspaceId"
                params={{ workspaceId }}
                variant="outline"
              >
                <ArrowLeft />
                Go back to workspace
              </Link>
              {error.message && <Code>{error.message}</Code>}
            </div>
          </ErrorContent>
        )
      case 'INVALID_CONTENT':
        return (
          <ErrorContent
            title="Invalid note content"
            description="The note you're looking for has an invalid content. You can try reloading the page or create a new note."
          >
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/workspace/$workspaceId"
                params={{ workspaceId }}
                variant="outline"
              >
                <ArrowLeft />
                Go back to workspace
              </Link>
              <div className="flex flex-row items-center gap-4">
                <Button
                  variant={'destructive'}
                  onClick={() => deleteNoteAndRefresh(noteId)}
                >
                  Delete note
                </Button>
                <Button onClick={reset}>Reload page</Button>
              </div>
              {error.message && <Code>{error.message}</Code>}
            </div>
          </ErrorContent>
        )
      case 'READ_FAILED':
        return (
          <ErrorContent
            title="Failed to read note"
            description="An unexpected error occurred while reading the note."
          />
        )
    }
  }

  return (
    <ErrorContent
      title="Something went wrong"
      description="An unexpected error occurred."
    />
  )
}

const ErrorContent = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10">
          <AlertCircle className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  )
}
