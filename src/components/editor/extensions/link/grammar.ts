export interface LinkSource {
  label: string
  href: string
  title: string | null
}

const LINK_SOURCE_REGEX = /^\[([^\]]*)\]\(([^\s)]*)(?: "([^"]*)")?\)$/

export function parseLinkSource(raw: string): LinkSource | null {
  const match = raw.match(LINK_SOURCE_REGEX)
  if (!match) return null

  const [, label, href, title] = match
  return {
    label,
    href,
    title: title ?? null,
  }
}

export function serializeLinkSource({
  label,
  href,
  title,
}: LinkSource): string {
  const titleSuffix = title ? ` "${title}"` : ''
  return `[${label}](${href}${titleSuffix})`
}
