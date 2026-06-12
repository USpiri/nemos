import { describe, expect, it } from 'vitest'
import { resolveSettings } from './resolve-settings'

describe('resolveSettings', () => {
  it('workspace key overrides global', () => {
    const global = { theme: 'system', autoSyncTheme: true }
    const workspace = { theme: 'dark' }
    expect(resolveSettings(global, workspace)).toEqual({
      theme: 'dark',
      autoSyncTheme: true,
    })
  })

  it('falls back to global when key is absent from workspace delta', () => {
    const global = { theme: 'system', autoSyncTheme: true }
    expect(resolveSettings(global, {})).toEqual({
      theme: 'system',
      autoSyncTheme: true,
    })
  })

  it('empty workspace delta returns full global', () => {
    const global = { theme: 'system', autoSyncTheme: true }
    expect(resolveSettings(global, {})).toEqual(global)
  })

  it('partial workspace delta merges correctly', () => {
    const global = { theme: 'system', autoSyncTheme: true }
    const workspace = { autoSyncTheme: false }
    expect(resolveSettings(global, workspace)).toEqual({
      theme: 'system',
      autoSyncTheme: false,
    })
  })
})
