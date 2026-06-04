import { useSidebar } from '@/components/ui/sidebar'
import { useUiStore } from '@/store/ui.store'

const MIN_WIDTH = 200
const MAX_WIDTH = 400

export const SidebarResizeHandle = () => {
  const { state } = useSidebar()
  const setSidebarWidth = useUiStore((s) => s.setSidebarWidth)

  if (state !== 'expanded') return null

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    document.documentElement.setAttribute('data-sidebar-resizing', '')
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
    setSidebarWidth(newWidth)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    document.documentElement.removeAttribute('data-sidebar-resizing')
  }

  return (
    <div
      className="absolute top-0 right-0 z-20 h-full w-1 cursor-col-resize opacity-0 hover:opacity-100 hover:bg-sidebar-border transition-opacity"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}
