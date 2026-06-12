import { describe, expect, it } from 'vitest'
import { AppearanceSettings } from '@/lib/settings'
import type { ThemeDescriptor } from './theme.types'
import { mergeThemes, toDisplayName } from './utils'

describe('toDisplayName', () => {
  it('replaces hyphens with spaces and title-cases each word', () => {
    expect(toDisplayName('my-dracula-theme')).toBe('My Dracula Theme')
  })

  it('replaces underscores with spaces and title-cases each word', () => {
    expect(toDisplayName('my_dark_theme')).toBe('My Dark Theme')
  })

  it('handles mixed hyphens and underscores', () => {
    expect(toDisplayName('my_dracula-theme')).toBe('My Dracula Theme')
  })

  it('handles a single word', () => {
    expect(toDisplayName('dracula')).toBe('Dracula')
  })
})

describe('mergeThemes', () => {
  const g = (id: string): ThemeDescriptor => ({ id, displayName: toDisplayName(id) })

  it('returns global-only themes when no workspace themes exist', () => {
    const result = mergeThemes([g('alpha'), g('beta')], [])
    expect(result.map((t) => t.id)).toEqual(['alpha', 'beta'])
  })

  it('returns workspace-only themes when no global themes exist', () => {
    const result = mergeThemes([], [g('gamma'), g('delta')])
    expect(result.map((t) => t.id)).toEqual(['delta', 'gamma'])
  })

  it('workspace entry wins on ID collision', () => {
    const globalTheme: ThemeDescriptor = { id: 'my-theme', displayName: 'Global Name' }
    const workspaceTheme: ThemeDescriptor = { id: 'my-theme', displayName: 'Workspace Name' }
    const result = mergeThemes([globalTheme], [workspaceTheme])
    expect(result).toHaveLength(1)
    expect(result[0].displayName).toBe('Workspace Name')
  })

  it('result is sorted alphabetically by displayName', () => {
    const result = mergeThemes(
      [g('zebra-theme'), g('apple-theme')],
      [g('mango-theme')],
    )
    expect(result.map((t) => t.displayName)).toEqual([
      'Apple Theme',
      'Mango Theme',
      'Zebra Theme',
    ])
  })

  it('returns empty array when both lists are empty', () => {
    expect(mergeThemes([], [])).toEqual([])
  })
})

describe('AppearanceSettings schema — activeTheme', () => {
  it('defaults activeTheme to null when field is missing', () => {
    const result = AppearanceSettings.safeParse({ theme: 'system', autoSyncTheme: true })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.activeTheme).toBeNull()
  })

  it('accepts a string value for activeTheme', () => {
    const result = AppearanceSettings.safeParse({
      theme: 'system',
      autoSyncTheme: true,
      activeTheme: 'my-theme',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.activeTheme).toBe('my-theme')
  })

  it('accepts null for activeTheme', () => {
    const result = AppearanceSettings.safeParse({
      theme: 'system',
      autoSyncTheme: true,
      activeTheme: null,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.activeTheme).toBeNull()
  })

  it('rejects a number value for activeTheme', () => {
    const result = AppearanceSettings.safeParse({
      theme: 'system',
      autoSyncTheme: true,
      activeTheme: 42,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a boolean value for activeTheme', () => {
    const result = AppearanceSettings.safeParse({
      theme: 'system',
      autoSyncTheme: true,
      activeTheme: true,
    })
    expect(result.success).toBe(false)
  })
})
