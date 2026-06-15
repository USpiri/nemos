import { MonitorCog, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Theme } from '@/lib/settings'
import { useAppearanceSettings } from '@/lib/settings'
import { loadThemes } from '@/lib/themes/service/load-themes'
import type { ThemeDescriptor } from '@/lib/themes/theme.types'
import { cn } from '@/lib/utils'
import { OverrideIndicator } from '../OverrideIndicator'

const DEFAULT_THEME = '__default__'

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: MonitorCog },
]

export const AppearanceSection = () => {
  const theme = useAppearanceSettings((s) => s.theme)
  const autoSyncTheme = useAppearanceSettings((s) => s.autoSyncTheme)
  const activeTheme = useAppearanceSettings((s) => s.activeTheme)
  const workspacePath = useAppearanceSettings((s) => s.workspacePath)
  const update = useAppearanceSettings((s) => s.update)
  const revertKey = useAppearanceSettings((s) => s.revertKey)
  const workspaceDelta = useAppearanceSettings((s) => s.workspaceDelta)

  const [availableThemes, setAvailableThemes] = useState<ThemeDescriptor[]>([])

  useEffect(() => {
    if (!workspacePath) return
    loadThemes(workspacePath)
      .then(setAvailableThemes)
      .catch((e) => console.error('Failed to load themes', e))
  }, [workspacePath])

  const hasAutoSyncThemeOrThemeDelta =
    workspaceDelta.autoSyncTheme !== undefined ||
    workspaceDelta.theme !== undefined
  const hasActiveThemeDelta = workspaceDelta.activeTheme !== undefined

  const handleAutoSyncThemeChange = (checked: boolean) => {
    update({ autoSyncTheme: theme === 'system' ? checked : false })
  }

  const handleThemeChange = (value: string) => {
    update({ activeTheme: value === DEFAULT_THEME ? null : value })
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
      <div className="flex items-center gap-2">
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
        {hasAutoSyncThemeOrThemeDelta && (
          <OverrideIndicator
            onRevert={() => {
              revertKey('theme')
              revertKey('autoSyncTheme')
            }}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Custom theme</FieldLabel>
          </FieldContent>
          <Select
            value={activeTheme ?? DEFAULT_THEME}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_THEME}>Default</SelectItem>
              {availableThemes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {hasActiveThemeDelta && (
          <OverrideIndicator onRevert={() => revertKey('activeTheme')} />
        )}
      </div>
    </div>
  )
}
