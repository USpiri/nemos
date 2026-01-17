import { cn } from '@/lib/utils'
import { useTabsStore } from '@/store'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Tab } from './Tab'

interface Props {
  className?: string
}

export const Tabs = ({ className }: Props) => {
  const tabs = useTabsStore((s) => s.tabs)
  const activeTab = useTabsStore((s) => s.getActiveTab())

  if (tabs.length === 0) return null

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="overflow-x-auto *:py-2">
        <div className={cn('flex h-8 flex-1 items-stretch', className)}>
          {tabs.map((tab) => (
            <Tab key={tab.id} tab={tab} isActive={tab.id === activeTab?.id} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-0.5" />
      </ScrollArea>
    </div>
  )
}
