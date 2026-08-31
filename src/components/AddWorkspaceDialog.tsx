import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDialog } from '@/hooks/use-dialog'
import { usePinWorkspace } from '@/hooks/use-pin-workspace'
import { openFolderDialog } from '@/lib/dialog'
import { defaultWorkspaceParentPath, rootFolderName } from '@/lib/paths'
import {
  AddWorkspaceInput,
  addWorkspaceSchema,
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

/**
 * A Workspace is a pin onto an existing folder (#86) — nothing gets created
 * on disk here. Picking a folder becomes that folder's Root directly, and
 * submitting pins it under the (editable) display name.
 */
export const AddWorkspaceDialog = () => {
  const { close, isOpen } = useDialog()
  const { pinWorkspace } = usePinWorkspace()
  const navigate = useNavigate()
  const open = isOpen('add-workspace')

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddWorkspaceInput>({
    resolver: zodResolver(addWorkspaceSchema),
    defaultValues: { path: '', name: '' },
  })

  const path = watch('path')

  const handleBrowse = useCallback(async () => {
    const defaultPath = await defaultWorkspaceParentPath()
    const picked = await openFolderDialog(defaultPath)
    if (!picked) return
    setValue('path', picked, { shouldValidate: true })
    setValue('name', rootFolderName(picked), { shouldValidate: true })
  }, [setValue])

  const handleBrowseKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      handleBrowse()
    },
    [handleBrowse],
  )

  const onSubmit = useCallback(
    async (data: AddWorkspaceInput) => {
      await pinWorkspace(data.path, data.name, () => {
        close()
        reset()
        navigate({
          to: '/workspace/$rootPath',
          params: { rootPath: data.path },
        })
      })
    },
    [pinWorkspace, navigate, close, reset],
  )

  const handleClose = () => {
    close()
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Add Workspace</DialogTitle>
          <DialogDescription>
            Pin an existing folder as a Workspace for quick access
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="path">Folder</FieldLabel>
              <Input
                id="path"
                readOnly
                placeholder="Choose a folder..."
                value={path}
                onClick={handleBrowse}
                onKeyDown={handleBrowseKeyDown}
                aria-invalid={!!errors.path}
                className="cursor-pointer"
              />
              <FieldDescription>
                Click to choose the folder to pin as a Workspace
              </FieldDescription>
              {errors.path && <FieldError errors={[errors.path]} />}
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
                Shown in the sidebar — defaults to the folder&apos;s name
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
              {isSubmitting ? 'Adding...' : 'Add Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
