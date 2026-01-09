import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { UpdateChecker } from "@/components/UpdateChecker";
import { getWorkspaces } from "@/lib/workspace";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GlobalError } from "./-components/GlobalError";
import { GlobalDialogs } from "@/components/GlobalDialogs";

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    const workspaces = await getWorkspaces();
    return { workspaces };
  },
  errorComponent: GlobalError,
});

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
  );
}
