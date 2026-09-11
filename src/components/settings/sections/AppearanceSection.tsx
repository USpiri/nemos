import { FolderOpen, MonitorCog, Moon, RefreshCw, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ROOT_SNIPPETS_DIR, SNIPPETS_DIR } from '@/config/constants'
import { useReloadStyles } from '@/hooks/use-reload-styles'
import { ensureDir, ensureDirAppData } from '@/lib/fs'
import { openAppDataPath, revealPath } from '@/lib/opener'
import type { Theme } from '@/lib/settings'
import { useAppearanceSettings } from '@/lib/settings'
import { loadCssSnippets, toggleSnippetId } from '@/lib/themes'
import { loadThemes } from '@/lib/themes/service/load-themes'
import type {
  SnippetDescriptor,
  ThemeDescriptor,
} from '@/lib/themes/theme.types'
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
  const rootPath = useAppearanceSettings((s) => s.rootPath)
  const disabledGlobalSnippets = useAppearanceSettings(
    (s) => s.disabledGlobalSnippets,
  )
  const disabledRootSnippets = useAppearanceSettings(
    (s) => s.disabledRootSnippets,
  )
  const update = useAppearanceSettings((s) => s.update)
  const revertKey = useAppearanceSettings((s) => s.revertKey)
  const rootDelta = useAppearanceSettings((s) => s.rootDelta)

  const reloadStyles = useReloadStyles()

  const [availableThemes, setAvailableThemes] = useState<ThemeDescriptor[]>([])
  const [globalSnippets, setGlobalSnippets] = useState<SnippetDescriptor[]>([])
  const [rootSnippets, setRootSnippets] = useState<SnippetDescriptor[]>([])

  useEffect(() => {
    if (!rootPath) return
    loadThemes(rootPath)
      .then(setAvailableThemes)
      .catch((e) => console.error('Failed to load themes', e))
    loadCssSnippets(rootPath)
      .then(({ globalSnippets, rootSnippets }) => {
        setGlobalSnippets(globalSnippets)
        setRootSnippets(rootSnippets)
      })
      .catch((e) => console.error('Failed to load snippets', e))
  }, [rootPath])

  const hasAutoSyncThemeOrThemeDelta =
    rootDelta.autoSyncTheme !== undefined || rootDelta.theme !== undefined
  const hasActiveThemeDelta = rootDelta.activeTheme !== undefined

  const handleAutoSyncThemeChange = (checked: boolean) => {
    update({ autoSyncTheme: theme === 'system' ? checked : false })
  }

  const handleThemeChange = (value: string) => {
    update({ activeTheme: value === DEFAULT_THEME ? null : value })
  }

  const handleToggleGlobalSnippet = (id: string) => {
    update({
      disabledGlobalSnippets: toggleSnippetId(disabledGlobalSnippets, id),
    })
  }

  const handleToggleRootSnippet = (id: string) => {
    update({
      disabledRootSnippets: toggleSnippetId(disabledRootSnippets, id),
    })
  }

  const handleReloadStyles = () => {
    reloadStyles()
      .then(({ globalSnippets, rootSnippets }) => {
        setGlobalSnippets(globalSnippets)
        setRootSnippets(rootSnippets)
      })
      .catch((e) => console.error('Failed to reload styles', e))
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

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-medium text-sm">Global snippets</p>
          <p className="text-muted-foreground text-xs">
            CSS snippets applied across all Roots.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() =>
            ensureDirAppData(SNIPPETS_DIR).then(() =>
              openAppDataPath(SNIPPETS_DIR),
            )
          }
        >
          <FolderOpen className="size-3.5" />
          Open folder
        </Button>
      </div>
      {globalSnippets.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          No snippets found. Add <code>.css</code> files to the global snippets
          folder.
        </p>
      ) : (
        <div className="space-y-2">
          {globalSnippets.map((s) => (
            <Field key={s.id} orientation="horizontal">
              <FieldContent>
                <FieldLabel
                  htmlFor={`global-snippet-${s.id}`}
                  className="text-xs"
                >
                  {s.displayName}
                </FieldLabel>
                <FieldDescription className="text-xs">
                  {s.id}.css
                </FieldDescription>
              </FieldContent>
              <Switch
                id={`global-snippet-${s.id}`}
                checked={!disabledGlobalSnippets.includes(s.id)}
                onCheckedChange={() => handleToggleGlobalSnippet(s.id)}
              />
            </Field>
          ))}
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-medium text-sm">Root snippets</p>
          <p className="text-muted-foreground text-xs">
            CSS snippets applied only in this Root.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => {
            if (!rootPath) return
            const dir = `${rootPath}/${ROOT_SNIPPETS_DIR}`
            ensureDir(dir).then(() => revealPath(dir))
          }}
        >
          <FolderOpen className="size-3.5" />
          Open folder
        </Button>
      </div>
      {rootSnippets.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          No snippets found. Add <code>.css</code> files to the Root snippets
          folder.
        </p>
      ) : (
        <div className="space-y-2">
          {rootSnippets.map((s) => (
            <Field key={s.id} orientation="horizontal">
              <FieldContent>
                <FieldLabel
                  htmlFor={`root-snippet-${s.id}`}
                  className="text-xs"
                >
                  {s.displayName}
                </FieldLabel>
                <FieldDescription className="text-xs">
                  {s.id}.css
                </FieldDescription>
              </FieldContent>
              <Switch
                id={`root-snippet-${s.id}`}
                checked={!disabledRootSnippets.includes(s.id)}
                onCheckedChange={() => handleToggleRootSnippet(s.id)}
              />
            </Field>
          ))}
        </div>
      )}

      <Separator />

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={handleReloadStyles}
      >
        <RefreshCw className="size-3.5" />
        Reload styles
      </Button>
    </div>
  )
}
