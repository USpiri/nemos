import { Loader2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { useDialog } from '@/hooks/use-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { SidebarProvider } from '../ui/sidebar'
import { type CategoryId, SettingsSidebar } from './SettingsSidebar'

const sections: Record<CategoryId, React.LazyExoticComponent<React.FC>> = {
  general: lazy(() =>
    import('./sections/GeneralSection').then((m) => ({
      default: m.GeneralSection,
    })),
  ),
  editor: lazy(() =>
    import('./sections/EditorSection').then((m) => ({
      default: m.EditorSection,
    })),
  ),
  appearance: lazy(() =>
    import('./sections/AppearanceSection').then((m) => ({
      default: m.AppearanceSection,
    })),
  ),
  shortcuts: lazy(() =>
    import('./sections/ShortcutsSection').then((m) => ({
      default: m.ShortcutsSection,
    })),
  ),
  about: lazy(() =>
    import('./sections/AboutSection').then((m) => ({
      default: m.AboutSection,
    })),
  ),
}

export const SettingsDialog = () => {
  const { close, isOpen } = useDialog()
  const [activeCategory, setActiveCategory] = useState<CategoryId>('general')

  const Section = sections[activeCategory]

  return (
    <Dialog open={isOpen('settings')} onOpenChange={close}>
      <DialogContent className="h-full overflow-hidden p-0 sm:max-w-3xl md:max-h-125">
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Application settings</DialogDescription>
        </DialogHeader>
        <SidebarProvider
          style={
            {
              '--sidebar-width': '20rem',
              '--sidebar-width-mobile': '10rem',
            } as React.CSSProperties
          }
          className="h-full min-h-0! items-start"
        >
          <SettingsSidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <ScrollArea className="h-full flex-1">
            <main className="p-5">
              <Suspense fallback={<Loader2 className="size-4 animate-spin" />}>
                <div className="fade-in animate-in duration-200">
                  <Section />
                </div>
              </Suspense>
            </main>
          </ScrollArea>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
