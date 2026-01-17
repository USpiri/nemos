import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const routerHistory = localStorage.getItem('router-history')
  let lastLocation: string | null = null

  if (routerHistory) {
    try {
      lastLocation = JSON.parse(routerHistory)
    } catch {
      lastLocation = routerHistory
    }
  }

  if (lastLocation) {
    return <Navigate to={lastLocation} />
  }

  return <Navigate to="/workspace" />
}
