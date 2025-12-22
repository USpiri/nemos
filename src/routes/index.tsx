import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const routerHistory = localStorage.getItem("router-history");
  if (routerHistory) {
    return <Navigate to={routerHistory} />;
  }

  // TODO: Create a welcome page
  return <div>Index Route</div>;
}
