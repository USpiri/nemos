import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initialize } from '@/lib/app'
import { routeTree } from '@/lib/generated/routeTree.gen'

import './index.css'

// Sync theme before React renders to prevent flash of wrong theme
{
  const syncTheme = localStorage.getItem('nemos-theme') ?? 'dark'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = syncTheme === 'dark' || (syncTheme === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark)
}

const router = createRouter({ routeTree, defaultPendingMinMs: 0 })
router.subscribe('onLoad', (context) => {
  if (context.toLocation.pathname === '/')
    localStorage.removeItem('router-history')

  localStorage.setItem(
    'router-history',
    JSON.stringify(context.toLocation.pathname),
  )
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const bootstrap = async () => {
  await initialize()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

bootstrap().catch((error) => {
  console.error('Failed to start app', error)
})
