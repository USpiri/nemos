import { Providers } from "@/components/providers";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Providers>
        <Outlet />
      </Providers>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
