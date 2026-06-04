import { useEffect, useRef } from 'react'
import { useSidebar } from '@/components/ui/sidebar'
import { useUiStore } from '@/store/ui.store'

const MIN_WIDTH = 200
const MAX_WIDTH = 400

export const SidebarResizeHandle = () => {
  const { state } = useSidebar()
  const setSidebarWidth = useUiStore((s) => s.setSidebarWidth)
  const liveWidthRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-sidebar-resizing')
    }
  }, [])

  if (state !== 'expanded') return null

  const getWrapper = () =>
    document.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    document.documentElement.setAttribute('data-sidebar-resizing', '')
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    // e.clientX === sidebar width because the sidebar is anchored at left: 0
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
    liveWidthRef.current = newWidth
    // Update CSS variable directly — no React re-renders or localStorage writes during drag
    getWrapper()?.style.setProperty('--sidebar-width', `${newWidth}px`)
  }

  const persist = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    document.documentElement.removeAttribute('data-sidebar-resizing')
    if (liveWidthRef.current !== null) {
      setSidebarWidth(liveWidthRef.current)
      liveWidthRef.current = null
    }
  }

  return (
    <div
      className="absolute inset-y-0 -right-2 z-20 hidden w-4 cursor-col-resize items-center justify-center transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-sidebar-border sm:flex"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={persist}
      onPointerCancel={persist}
    >
      <div className="relative z-10 h-6 w-1 shrink-0 rounded-lg bg-sidebar-border" />
    </div>
  )
}
