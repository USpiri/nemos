/**
 * GitHub-Flavored-Markdown heading slug algorithm: lowercase, strip
 * punctuation, spaces to hyphens. Unicode letters/numbers are kept so
 * non-ASCII heading text still slugs sensibly.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
}

/**
 * Slugifies every heading in document order, de-duplicating repeats with a
 * `-1`, `-2`, ... suffix (GitHub's own convention) so identical heading text
 * still gets distinct, individually addressable anchors.
 */
export function slugifyHeadings(headings: string[]): string[] {
  const counts = new Map<string, number>()

  return headings.map((heading) => {
    const base = slugify(heading)
    const count = counts.get(base) ?? 0
    counts.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  })
}
