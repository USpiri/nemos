import { useUiStore } from '@/store/ui.store'
import { SidebarProvider as SidebarProviderBase } from '../ui/sidebar'

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const open = useUiStore((state) => state.sidebarOpen)
  const setOpen = useUiStore((state) => state.setSidebarState)
  const sidebarWidth = useUiStore((state) => state.sidebarWidth)

  return (
    <SidebarProviderBase
      open={open}
      onOpenChange={setOpen}
      style={
        { '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties
      }
    >
      {children}
    </SidebarProviderBase>
  )
}
