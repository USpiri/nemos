/**
 * Wiring the Link extension needs to resolve and follow Note/Heading Anchor
 * links (ADR-0011) — supplied per Editor instance via `Link.configure(...)`
 * from `useLinkNavigation` (see src/hooks/use-link-navigation.ts), since
 * these depend on which Root/Note is currently open.
 */
export interface LinkNavigationOptions {
  rootPath: string
  currentNotePath: string
  noteExists: (relativePath: string) => boolean
  // Navigating to the current Note's own path with an `anchor` is also how
  // a same-document Heading Anchor is followed — it's a hash-only
  // navigation, and the router's own `hashScrollIntoView` (on by default)
  // scrolls to the heading's `id` (see extensions/heading-anchors), so
  // there's no separate scroll mechanism to wire up.
  onNavigateToNote: (
    relativePath: string,
    options?: { anchor?: string },
  ) => void
  onCreateNote: (relativePath: string) => void
}

export const defaultLinkNavigationOptions: LinkNavigationOptions = {
  rootPath: '',
  currentNotePath: '',
  noteExists: () => false,
  onNavigateToNote: () => {
    // No-op default; useLinkNavigation supplies the real callback.
  },
  onCreateNote: () => {
    // No-op default; useLinkNavigation supplies the real callback.
  },
}
