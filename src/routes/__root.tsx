import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { getWorkspaces } from "@/lib/workspace";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GlobalError } from "./-components/GlobalError";

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
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
