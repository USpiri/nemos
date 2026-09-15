# Nemos Theming API

This document defines the public CSS contract for Nemos Themes and CSS Snippets. Selectors and variables listed here are stable — they will not be renamed or removed without a major version bump.

Theme authors can override any CSS variable, target any structural selector, or inject arbitrary CSS. There is no restriction to variable-only overrides.

---

## Injection order

Styles are applied in this order:

1. Nemos base styles
2. Active Theme (`theme.css`)
3. CSS Snippets — Global first, then Root

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

Nemos configures Mermaid with a custom `base` theme built from these variables. Overriding one changes it across every diagram type (flowchart, ER, sequence, gantt, pie, etc.) that uses that role.

Note: because Mermaid's theme is resolved once when the diagram engine loads, a Theme (or Snippet) change to these variables may require reopening the note before it's picked up.

| Variable | Purpose |
|----------|---------|
| `--mermaid-background` | Diagram background |
| `--mermaid-font-family` | Diagram text font |

**Core palette**

| Variable | Purpose |
|----------|---------|
| `--mermaid-primary-color` | Node fill |
| `--mermaid-primary-text-color` | Node text |
| `--mermaid-primary-border-color` | Node border |
| `--mermaid-secondary-color` | Secondary node fill |
| `--mermaid-secondary-text-color` | Secondary node text |
| `--mermaid-secondary-border-color` | Secondary node border |
| `--mermaid-tertiary-color` | Tertiary node fill |
| `--mermaid-tertiary-text-color` | Tertiary node text |
| `--mermaid-tertiary-border-color` | Tertiary node border |
| `--mermaid-line-color` | Connector lines |
| `--mermaid-text-color` | Default diagram text |
| `--mermaid-title-color` | Diagram/section titles |

**Flowchart / ER diagram**

| Variable | Purpose |
|----------|---------|
| `--mermaid-main-bkg` | Node background |
| `--mermaid-node-border` | Node border |
| `--mermaid-cluster-bkg` | Subgraph/cluster background |
| `--mermaid-cluster-border` | Subgraph/cluster border |
| `--mermaid-default-link-color` | Edge line color |
| `--mermaid-edge-label-background` | Edge label background |
| `--mermaid-edge-label-color` | Edge label text |
| `--mermaid-error-bkg-color` | Parse error background |
| `--mermaid-error-text-color` | Parse error text |
| `--mermaid-note-bkg-color` | Note background |
| `--mermaid-note-text-color` | Note text |
| `--mermaid-note-border-color` | Note border |
| `--mermaid-row-odd` | ER attribute table odd row background |
| `--mermaid-row-even` | ER attribute table even row background |

**Sequence diagram**

| Variable | Purpose |
|----------|---------|
| `--mermaid-actor-bkg` | Actor box background |
| `--mermaid-actor-border` | Actor box border |
| `--mermaid-actor-text-color` | Actor label text |
| `--mermaid-actor-line-color` | Actor lifeline |
| `--mermaid-signal-color` | Message arrow color |
| `--mermaid-signal-text-color` | Message text |
| `--mermaid-label-box-bkg-color` | Loop/alt label box background |
| `--mermaid-label-box-border-color` | Loop/alt label box border |
| `--mermaid-label-text-color` | Loop/alt label text |
| `--mermaid-loop-text-color` | Loop/alt condition text |
| `--mermaid-activation-border-color` | Activation bar border |
| `--mermaid-activation-bkg-color` | Activation bar background |
| `--mermaid-sequence-number-color` | Message sequence number text |
| `--mermaid-person-bkg` | Person actor shape background |
| `--mermaid-person-border` | Person actor shape border |

**State diagram**

| Variable | Purpose |
|----------|---------|
| `--mermaid-state-bkg` | State node background |
| `--mermaid-state-label-color` | State node text |
| `--mermaid-transition-color` | Transition arrow color |
| `--mermaid-transition-label-color` | Transition label text |
| `--mermaid-label-background-color` | Transition label background |
| `--mermaid-composite-background` | Composite (nested) state background |
| `--mermaid-composite-title-background` | Composite state title bar background |
| `--mermaid-composite-border` | Composite state border |
| `--mermaid-inner-end-background` | Final-state inner circle fill |
| `--mermaid-special-state-color` | Start/end state circle fill |

**Class diagram**

| Variable | Purpose |
|----------|---------|
| `--mermaid-class-text` | Class name/member text |
| `--mermaid-relation-color` | Relationship line color |
| `--mermaid-relation-label-background` | Relationship label background |
| `--mermaid-relation-label-color` | Relationship label text |

**Gantt chart**

| Variable | Purpose |
|----------|---------|
| `--mermaid-section-bkg-color` | Section band background |
| `--mermaid-alt-section-bkg-color` | Alternating section band background |
| `--mermaid-task-border-color` | Task bar border |
| `--mermaid-task-bkg-color` | Task bar background |
| `--mermaid-task-text-color` | Task text (on task bar) |
| `--mermaid-task-text-light-color` | Task text (on light background) |
| `--mermaid-task-text-outside-color` | Task text (outside bar) |
| `--mermaid-task-text-clickable-color` | Clickable task text |
| `--mermaid-active-task-border-color` | Active task border |
| `--mermaid-active-task-bkg-color` | Active task background |
| `--mermaid-grid-color` | Grid lines |
| `--mermaid-done-task-bkg-color` | Done task background |
| `--mermaid-done-task-border-color` | Done task border |
| `--mermaid-crit-border-color` | Critical task border |
| `--mermaid-crit-bkg-color` | Critical task background |
| `--mermaid-today-line-color` | "Today" marker line |

**Pie chart**

| Variable | Purpose |
|----------|---------|
| `--mermaid-pie-1` through `--mermaid-pie-5` | Slice fills |
| `--mermaid-pie-title-text-color` | Chart title |
| `--mermaid-pie-section-text-color` | Slice value labels |
| `--mermaid-pie-legend-text-color` | Legend text |
| `--mermaid-pie-stroke-color` | Slice border |
| `--mermaid-pie-outer-stroke-color` | Outer circle border |
| `--mermaid-pie-opacity` | Slice fill opacity |

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
