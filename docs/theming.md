# Nemos Theming API

This document defines the public CSS contract for Nemos Themes and CSS Snippets. Selectors and variables listed here are stable — they will not be renamed or removed without a major version bump.

Theme authors can override any CSS variable, target any structural selector, or inject arbitrary CSS. There is no restriction to variable-only overrides.

---

## Injection order

Styles are applied in this order:

1. Nemos base styles
2. Active Theme (`theme.css`)
3. CSS Snippets — Global first, then Workspace

Later layers win on any property conflict via CSS cascade. A Theme that only overrides one variable leaves everything else untouched.

---

## Light and dark mode

The `.dark` class is toggled on `<html>` by the app. Theme authors can target either mode:

```css
/* light mode */
.note { background: white; }

/* dark mode */
.dark .note { background: #111; }
```

The light/dark/system toggle works independently of the active Theme.

---

## Structural selectors

These classes are owned by Nemos and stable across internal refactors. They will not change when Tailwind, shadcn/ui, or other internal dependencies are updated.

| Selector | Region |
|----------|--------|
| `.sidebar` | Sidebar panel |
| `.topbar` | Tab bar and top header area |
| `.content` | Main content area (everything to the right of the sidebar) |
| `.note` | Note container. Also receives the value of the `cssClass` frontmatter field as an additional class. |
| `.editor` | Editable/rendered content body inside a note |

---

## Block-level selectors

These classes are on custom block wrappers rendered inside `.editor`.

| Selector | Block |
|----------|-------|
| `.codeblock` | Code block |
| `.mermaid` | Mermaid diagram |
| `.math-display` | Display math (block) |
| `.math-inline` | Inline math |
| `.smiles` | SMILES molecule diagram |
| `.table-wrapper` | Table |

Standard HTML elements inside `.editor` are also reliable targets: `h1`–`h6`, `p`, `blockquote`, `code`, `pre`, `ul`, `ol`, `li`, `a`, `img`, `hr`.

---

## CSS custom properties

All CSS custom properties defined in `src/index.css` are part of the public contract. Theme authors may override any of them. Dark mode overrides are defined on `.dark` — override the same variables there to change dark mode appearance.

### Color and surface tokens

| Variable | Purpose |
|----------|---------|
| `--background` | App background |
| `--foreground` | Default text color |
| `--card` | Card/panel background |
| `--card-foreground` | Card text |
| `--popover` | Popover background |
| `--popover-foreground` | Popover text |
| `--primary` | Primary accent color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary surface |
| `--secondary-foreground` | Text on secondary |
| `--muted` | Muted surface (subdued backgrounds) |
| `--muted-foreground` | Muted text |
| `--accent` | Accent surface (hover states, highlights) |
| `--accent-foreground` | Text on accent |
| `--destructive` | Destructive action color |
| `--border` | Default border color |
| `--input` | Input field border |
| `--ring` | Focus ring |
| `--selection` | Text selection background |
| `--selection-foreground` | Text selection foreground |
| `--radius` | Base border radius |

### Sidebar tokens

| Variable | Purpose |
|----------|---------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Sidebar primary accent |
| `--sidebar-primary-foreground` | Text on sidebar primary |
| `--sidebar-accent` | Sidebar hover/accent surface |
| `--sidebar-accent-foreground` | Text on sidebar accent |
| `--sidebar-border` | Sidebar border |
| `--sidebar-ring` | Sidebar focus ring |

### Code block syntax colors

Eleven slots for syntax highlighting, mapped to token categories by the built-in highlight theme. Override any slot to adjust the color for all tokens assigned to it.

`--codeblock-highlight-1` through `--codeblock-highlight-11`

### Mermaid diagram colors

| Variable | Purpose |
|----------|---------|
| `--mermaid-primary-color` | Node fill |
| `--mermaid-primary-text-color` | Node text |
| `--mermaid-primary-border-color` | Node border |
| `--mermaid-line-color` | Connector lines |
| `--mermaid-secondary-color` | Secondary node fill |
| `--mermaid-tertiary-color` | Tertiary node fill |
| `--mermaid-edge-label-background` | Edge label background |
| `--mermaid-edge-label-color` | Edge label text |

### SMILES molecule colors

One variable per element symbol, used by the SMILES chemistry renderer:

`--smiles-color-c`, `--smiles-color-o`, `--smiles-color-n`, `--smiles-color-f`, `--smiles-color-cl`, `--smiles-color-br`, `--smiles-color-i`, `--smiles-color-p`, `--smiles-color-s`, `--smiles-color-b`, `--smiles-color-si`, `--smiles-color-h`, `--smiles-color-background`

### Chart colors

`--chart-1` through `--chart-5`

---

## Implementation-specific hooks

The following attributes exist on DOM elements and can be used for state-based targeting. They are **not part of the stable contract** — they may change when underlying component libraries are updated. Themes relying on them may need adjustments across major versions.

- `data-sidebar` — attributes on shadcn/ui sidebar elements (`data-sidebar="sidebar"`, `data-sidebar="content"`, etc.)
- `data-slot` — shadcn/ui component region markers
- `data-state` — open/closed/active states (e.g., `data-state="open"`)
- `data-collapsible`, `data-variant`, `data-side` — sidebar configuration attributes

DOM hierarchy (parent/child/sibling relationships) is similarly not guaranteed stable, but is a normal part of CSS authoring and can be used for advanced targeting.
