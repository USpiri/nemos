import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { FolderOpen } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateWorkspace } from '@/hooks/use-create-workspace'
import { useDialog } from '@/hooks/use-dialog'
import { usePinWorkspace } from '@/hooks/use-pin-workspace'
import { openFolderDialog } from '@/lib/dialog'
import { defaultWorkspaceParentPath } from '@/lib/paths'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group'

export const WorkspaceFormDialog = () => {
  const { close, isOpen } = useDialog()
  const { createWorkspace } = useCreateWorkspace()
  const { pinWorkspace } = usePinWorkspace()
  const navigate = useNavigate()
  const open = isOpen('workspace')

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { location: '', name: '' },
  })

  useEffect(() => {
    if (!open) return
    defaultWorkspaceParentPath().then((location) => reset({ location, name: '' }))
  }, [open, reset])

  const handleBrowse = useCallback(async () => {
    const picked = await openFolderDialog()
    if (!picked) return
    setValue('location', picked, { shouldValidate: true })
  }, [setValue])

  const onSubmit = useCallback(
    async (data: CreateWorkspaceInput) => {
      await createWorkspace(data.location, data.name, async (path) => {
        await pinWorkspace(path)
        close()
        reset()
        navigate({
          to: '/workspace/$rootPath',
          params: { rootPath: path },
        })
      })
    },
    [createWorkspace, pinWorkspace, navigate, close, reset],
  )

  const handleClose = () => {
    close()
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Creates a new folder and pins it as a Workspace automatically
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="location"
                  autoComplete="off"
                  aria-invalid={!!errors.location}
                  {...register('location')}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={handleBrowse}
                    aria-label="Browse for a folder"
                  >
                    <FolderOpen />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Defaults to the nemos-app folder — browse to put this
                Workspace somewhere else instead
              </FieldDescription>
              {errors.location && <FieldError errors={[errors.location]} />}
            </Field>
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
                Becomes the new folder&apos;s name under Location
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
