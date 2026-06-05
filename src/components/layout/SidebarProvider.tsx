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
  const setSidebarWidth = useUiStore((state) => state.setSidebarWidth)

  return (
    <SidebarProviderBase
      open={open}
      onOpenChange={setOpen}
      defaultWidth={sidebarWidth}
      onWidthChange={setSidebarWidth}
    >
      {children}
    </SidebarProviderBase>
  )
}
