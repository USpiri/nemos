import { describe, expect, it } from 'vitest'
import { resolveSettings } from './resolve-settings'

const global = { theme: 'system', autoSyncTheme: true }
const workspace = { autoSyncTheme: false }

describe('resolveSettings', () => {
  it('workspace key overrides global', () => {
    expect(resolveSettings(global, workspace)).toEqual({
      theme: 'dark',
      autoSyncTheme: true,
    })
  })

  it('falls back to global when key is absent from workspace delta', () => {
    expect(resolveSettings(global, {})).toEqual({
      theme: 'system',
      autoSyncTheme: true,
    })
  })

  it('empty workspace delta returns full global', () => {
    expect(resolveSettings(global, {})).toEqual(global)
  })

  it('partial workspace delta merges correctly', () => {
    expect(resolveSettings(global, workspace)).toEqual({
      theme: 'system',
      autoSyncTheme: false,
    })
  })
})
