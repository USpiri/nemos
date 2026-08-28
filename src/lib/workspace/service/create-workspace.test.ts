import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockCreateDir, mockExists } = vi.hoisted(() => ({
  mockCreateDir: vi.fn(),
  mockExists: vi.fn(),
}))

vi.mock('@/lib/fs', async () => {
  const actual = await vi.importActual<typeof import('@/lib/fs')>('@/lib/fs')
  return {
    ...actual,
    createDir: mockCreateDir,
    exists: mockExists,
  }
})

describe('createWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExists.mockResolvedValue(false)
    mockCreateDir.mockResolvedValue(undefined)
  })

  it('creates the folder by joining the parent path with the name', async () => {
    const { createWorkspace } = await import('./create-workspace')

    const path = await createWorkspace(
      'C:/Users/x/Documents/nemos-app',
      'personal',
    )

    expect(mockCreateDir).toHaveBeenCalledWith(
      'C:/Users/x/Documents/nemos-app/personal',
    )
    expect(path).toBe('C:/Users/x/Documents/nemos-app/personal')
  })

  it('works for a parent path outside the default nemos-app location', async () => {
    const { createWorkspace } = await import('./create-workspace')

    const path = await createWorkspace('D:/projects', 'my-notes')

    expect(mockCreateDir).toHaveBeenCalledWith('D:/projects/my-notes')
    expect(path).toBe('D:/projects/my-notes')
  })

  it('throws INVALID_NAME without touching the filesystem for a bad name', async () => {
    const { createWorkspace } = await import('./create-workspace')
    const { WorkspaceError } = await import('../errors')

    await expect(
      createWorkspace('C:/Users/x/Documents/nemos-app', 'in/valid'),
    ).rejects.toMatchObject({ code: 'INVALID_NAME' } satisfies Partial<
      InstanceType<typeof WorkspaceError>
    >)
    expect(mockExists).not.toHaveBeenCalled()
    expect(mockCreateDir).not.toHaveBeenCalled()
  })

  it('throws ALREADY_EXISTS when the target path already exists', async () => {
    mockExists.mockResolvedValue(true)
    const { createWorkspace } = await import('./create-workspace')

    await expect(
      createWorkspace('C:/Users/x/Documents/nemos-app', 'personal'),
    ).rejects.toMatchObject({ code: 'ALREADY_EXISTS' })
    expect(mockCreateDir).not.toHaveBeenCalled()
  })
})
