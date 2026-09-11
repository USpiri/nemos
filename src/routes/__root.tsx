import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { GlobalDialogs } from '@/components/GlobalDialogs'
import { PinsMigrationChecker } from '@/components/PinsMigrationChecker'
import { Providers } from '@/components/providers'
import { UpdateChecker } from '@/components/UpdateChecker'
import { Toaster } from '@/components/ui/sonner'
import { getWorkspaces } from '@/lib/workspace'
import { GlobalError } from './-components/GlobalError'

export const Route = createRootRoute({
  component: RootComponent,
  loader: () => getWorkspaces(),
  errorComponent: GlobalError,
})

function RootComponent() {
  return (
    <>
      <Providers>
        <Outlet />
      </Providers>
      <UpdateChecker />
      <PinsMigrationChecker />
      <GlobalDialogs />
      <Toaster />
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  )
}
