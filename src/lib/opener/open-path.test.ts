import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockOpenPathFn, mockRevealItemInDir, mockJoin, mockAppDataDir } =
  vi.hoisted(() => ({
    mockOpenPathFn: vi.fn(),
    mockRevealItemInDir: vi.fn(),
    mockJoin: vi.fn(),
    mockAppDataDir: vi.fn(),
  }))

vi.mock('@tauri-apps/plugin-opener', () => ({
  openPath: mockOpenPathFn,
  revealItemInDir: mockRevealItemInDir,
}))

vi.mock('@tauri-apps/api/path', () => ({
  join: mockJoin,
  appDataDir: mockAppDataDir,
}))

describe('revealPath', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reveals an absolute path unmodified, without prefixing a base directory', async () => {
    const { revealPath } = await import('./open-path')

    await revealPath('D:/projects/my-notes/folder')

    expect(mockJoin).not.toHaveBeenCalled()
    expect(mockRevealItemInDir).toHaveBeenCalledWith(
      'D:/projects/my-notes/folder',
    )
  })
})

describe('openAppDataPath', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('joins the given relative path onto the app data directory', async () => {
    mockAppDataDir.mockResolvedValue('C:/Users/x/AppData/nemos')
    mockJoin.mockResolvedValue('C:/Users/x/AppData/nemos/snippets')

    const { openAppDataPath } = await import('./open-path')

    await openAppDataPath('snippets')

    expect(mockJoin).toHaveBeenCalledWith(
      'C:/Users/x/AppData/nemos',
      'snippets',
    )
    expect(mockOpenPathFn).toHaveBeenCalledWith(
      'C:/Users/x/AppData/nemos/snippets',
    )
  })
})
