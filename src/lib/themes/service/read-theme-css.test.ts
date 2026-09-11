import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readThemeCss } from './read-theme-css'

const { mockExists, mockExistsAppData, mockRead, mockReadAppData } = vi.hoisted(
  () => ({
    mockExists: vi.fn(),
    mockExistsAppData: vi.fn(),
    mockRead: vi.fn(),
    mockReadAppData: vi.fn(),
  }),
)

vi.mock('@/lib/fs', () => ({
  exists: mockExists,
  existsAppData: mockExistsAppData,
  read: mockRead,
  readAppData: mockReadAppData,
}))

const ROOT = 'nemos-app/my-root'

describe('readThemeCss', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when theme is not found anywhere', async () => {
    mockExists.mockResolvedValue(false)
    mockExistsAppData.mockResolvedValue(false)

    expect(await readThemeCss('missing', WORKSPACE)).toBeNull()
  })

  it('reads from root when theme.css exists there', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockResolvedValue('.ws { color: blue }')

    const result = await readThemeCss('my-theme', ROOT)

    expect(result).toBe('.ws { color: blue }')
    expect(mockRead).toHaveBeenCalledWith(
      `${ROOT}/.config/themes/my-theme/theme.css`,
    )
    expect(mockReadAppData).not.toHaveBeenCalled()
  })

  it('falls back to global when not found in root', async () => {
    mockExists.mockResolvedValue(false)
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockResolvedValue('.global { color: red }')

    const result = await readThemeCss('my-theme', ROOT)

    expect(result).toBe('.global { color: red }')
    expect(mockReadAppData).toHaveBeenCalledWith('themes/my-theme/theme.css')
  })

  it('prefers root over global on ID collision', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockResolvedValue('.ws {}')
    mockExistsAppData.mockResolvedValue(true)

    const result = await readThemeCss('shared', ROOT)

    expect(result).toBe('.ws {}')
    expect(mockReadAppData).not.toHaveBeenCalled()
  })

  it('skips root check when rootFsPath is null', async () => {
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockResolvedValue('.global {}')

    const result = await readThemeCss('my-theme', null)

    expect(result).toBe('.global {}')
    expect(mockExists).not.toHaveBeenCalled()
  })

  it('returns null when rootFsPath is null and global not found', async () => {
    mockExistsAppData.mockResolvedValue(false)

    expect(await readThemeCss('my-theme', null)).toBeNull()
  })

  it('falls back to global when root read throws', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockRejectedValue(new Error('io error'))
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockResolvedValue('.global {}')

    const result = await readThemeCss('my-theme', ROOT)

    expect(result).toBe('.global {}')
  })

  it('returns null without throwing when both reads fail', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockRejectedValue(new Error('io error'))
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockRejectedValue(new Error('io error'))

    await expect(readThemeCss('my-theme', ROOT)).resolves.toBeNull()
  })
})
