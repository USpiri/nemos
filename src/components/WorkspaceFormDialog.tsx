import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateWorkspace } from '@/hooks/use-create-workspace'
import { useDialog } from '@/hooks/use-dialog'
import {
  CreateWorkspaceInput,
  createWorkspaceSchema,
} from '@/lib/workspace/workspace.schema'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from './ui/field'
import { Input } from './ui/input'

export const WorkspaceFormDialog = () => {
  const { close, isOpen } = useDialog()
  const { createWorkspace } = useCreateWorkspace()
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
  })

  const onSubmit = useCallback(
    async (data: CreateWorkspaceInput) => {
      await createWorkspace(data.name, () => {
        close()
        reset()
        navigate({
          to: '/workspace/$workspaceId',
          params: { workspaceId: data.name },
        })
      })
    },
    [createWorkspace, navigate, close, reset],
  )

  const handleClose = () => {
    close()
    reset()
  }

  return (
    <Dialog open={isOpen('workspace')} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to store your files
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Workspace Name</FieldLabel>
              <Input
                id="name"
                placeholder="my-workspace"
                autoComplete="off"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldDescription>
                Choose a unique name for your workspace
              </FieldDescription>
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
