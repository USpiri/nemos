import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { GlobalDialogs } from '@/components/GlobalDialogs'
import { Providers } from '@/components/providers'
import { UpdateChecker } from '@/components/UpdateChecker'
import { Toaster } from '@/components/ui/sonner'
import { getWorkspaces } from '@/lib/workspace'
import { GlobalError } from './-components/GlobalError'

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    const workspaces = await getWorkspaces()
    return { workspaces }
  },
  errorComponent: GlobalError,
})

function RootComponent() {
  return (
    <>
      <Providers>
        <Outlet />
      </Providers>
      <UpdateChecker />
      <GlobalDialogs />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
