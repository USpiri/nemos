# Stable semantic CSS class layer as the public theming API

Nemos exposes a stable set of CSS class names on structural DOM regions and custom block elements. These classes form the public theming API alongside the CSS custom properties in `src/index.css`. The full contract is documented in `docs/theming.md`.

**Structural classes:** `.sidebar`, `.topbar`, `.content`, `.note`, `.editor`

**Block-level classes:** `.codeblock`, `.mermaid`, `.math-display`, `.math-inline`, `.smiles`, `.table-wrapper`

These names are owned by Nemos and will not change when internal dependencies (Tailwind, shadcn/ui, TipTap, or DOM structure) are refactored. No `nemos-` namespace prefix is used.

The alternative was to expose only CSS custom properties and let theme authors rely on Tailwind utility classes or shadcn `data-*` attributes for structural targeting. We rejected it because theme authors who want to recreate a full visual experience (typography, layout, spacing, custom block appearance) cannot do so through variable overrides alone — they need stable selectors to target specific regions of the UI independently. Without an owned semantic layer, any internal refactor could silently break user-authored themes.

No `nemos-` prefix was applied to the class names. The app runs in a sandboxed Tauri webview where external CSS collision is not a risk, and documentation — not naming convention — is what makes a contract stable. Shorter names are more ergonomic for theme authors.

`data-*` attributes from shadcn/ui and DOM hierarchy are acceptable for advanced state-based targeting by theme authors, but are explicitly documented as non-stable hooks subject to change with component library updates.
