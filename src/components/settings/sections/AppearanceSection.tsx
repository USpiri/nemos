import { MonitorCog, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import type { Theme } from '@/lib/settings'
import { useAppearanceSettings } from '@/lib/settings'
import { cn } from '@/lib/utils'

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: MonitorCog },
]

export const AppearanceSection = () => {
  const theme = useAppearanceSettings((s) => s.theme)
  const autoSyncTheme = useAppearanceSettings((s) => s.autoSyncTheme)
  const update = useAppearanceSettings((s) => s.update)

  const handleAutoSyncThemeChange = (checked: boolean) => {
    update({ autoSyncTheme: theme === 'system' ? checked : false })
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-medium text-base">Appearance</h2>
        <p className="text-muted-foreground text-sm">
          Choose how Nemos looks to you.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ value, label, icon: Icon }) => (
          <Button
            variant="ghost"
            key={value}
            onClick={() => update({ theme: value })}
            className={cn(
              'h-full flex-col p-4',
              theme === value
                ? 'border-primary bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20'
                : 'border-border bg-transparent',
            )}
          >
            <Icon className="size-5" />
            <span className="font-medium text-sm">{label}</span>
          </Button>
        ))}
      </div>
      <Field
        orientation="horizontal"
        className={cn(theme !== 'system' && 'cursor-not-allowed opacity-50')}
      >
        <FieldContent>
          <FieldLabel htmlFor="auto-sync-theme">Auto-sync theme</FieldLabel>
        </FieldContent>
        <Switch
          id="auto-sync-theme"
          disabled={theme !== 'system'}
          checked={theme === 'system' ? autoSyncTheme : false}
          onCheckedChange={handleAutoSyncThemeChange}
        />
      </Field>
    </div>
  )
}
