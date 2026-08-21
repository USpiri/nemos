import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Code, H1, P } from '@/components/ui/typography'
import { ROOT } from '@/config/constants'
import { useDialog } from '@/hooks/use-dialog'
import { getWorkspaces } from '@/lib/workspace'
import {
  WorkspaceEmpty,
  WorkspaceError,
  WorkspaceList,
  WorkspacePending,
} from './-components'
import { PrototypeSwitcher } from './-components/prototype-81/PrototypeSwitcher'
import { usePrototypeVariant } from './-components/prototype-81/use-prototype-variant'
import { VariantA } from './-components/prototype-81/VariantA'
import { VariantB } from './-components/prototype-81/VariantB'
import { VariantC } from './-components/prototype-81/VariantC'

export const Route = createFileRoute('/workspace/')({
  loader: async () => {
    const workspaces = await getWorkspaces()
    return { workspaces }
  },
  pendingComponent: WorkspacePending,
  errorComponent: WorkspaceError,
  component: WorkspaceIndex,
})

const PROTOTYPE_VARIANTS = [
  { key: 'A', label: 'Unified list' },
  { key: 'B', label: 'Grid + Recent table' },
  { key: 'C', label: 'Sidebar-first rail' },
]

function WorkspaceIndex() {
  const { workspaces } = Route.useLoaderData()
  const router = useRouter()
  const { open } = useDialog()

  // PROTOTYPE for issue #81 — dev-only, throwaway. See -components/prototype-81.
  const { variant, cycle } = usePrototypeVariant(
    PROTOTYPE_VARIANTS.map((v) => v.key),
    'A',
  )

  if (import.meta.env.DEV) {
    return (
      <>
        {variant === 'A' && <VariantA />}
        {variant === 'B' && <VariantB />}
        {variant === 'C' && <VariantC />}
        <PrototypeSwitcher
          variants={PROTOTYPE_VARIANTS}
          current={variant}
          onCycle={cycle}
        />
      </>
    )
  }

  const handleRefresh = () => {
    void router.invalidate()
  }

  const length = workspaces.length

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-10 py-32">
      <header className="max-w-2xl space-y-6">
        <H1 size="sm">Your workspaces</H1>
        <P variant="muted" size="sm">
          Each workspace is a folder you manage inside <Code>{ROOT}</Code>. Pick
          one to continue or create a new folder to start fresh.
        </P>
      </header>

      <section className="flex-1">
        {length ? (
          <WorkspaceList workspaces={workspaces} />
        ) : (
          <WorkspaceEmpty onRefresh={handleRefresh} />
        )}
      </section>

      <Button variant="outline" onClick={() => open('workspace')}>
        <FolderPlus /> Create a new workspace
      </Button>
    </div>
  )
}
