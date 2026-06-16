# Changelog

## Unreleased

### New Features

- **CSS Snippets**: Drop individual `.css` files into the global snippets folder (`<AppData>/snippets/`) or into a workspace's `.config/snippets/` folder to apply additive styles on top of the active theme. All snippets are enabled by default; each canendently be indep toggled on or off per workspace from Settings > Appearance. Global snippets are injected first; workspace snippets follow, so workspace rules win on any property conflict via the CSS cascade.
- **Custom theme system**: Drop a folder containing a `theme.css` file into the global themes directory or the workspace themes directory (`.config/themes/<ThemeID>/`). Theme CSS is injected after the app's base styles so the app never breaks regardless of what the file contains. The light/dark/system toggle continues to work independently. Themes are discovered from both scopes each time Appearance settings opens, workspace themes override global themes with the same ID.
- **Two-layer settings (Global + Workspace)**: Settings now operate on two layers — a Global Settings file in the OS app data directory and a per-workspace `.config/settings.json`.
- **Markdown as native format**: Notes are now stored as `.md` files. The editor serializes and deserializes content as Markdown using `@tiptap/markdown`, replacing the previous custom `.note` format.
- **Frontmatter support**: Notes now support YAML frontmatter (parsed via `gray-matter`) for structured metadata — title, tags, creation date, and update date are stored directly in each file.
- **Note Properties panel**: A new side panel in the note editor exposes the frontmatter fields (title, tags, dates) for direct editing without touching the raw file.
- **Tag management**: New `TagInput` / `TokenInput` components let you add and remove tags from the Note Properties panel.
- **Automatic migration**: On workspace load, a `MigrationOverlay` detects legacy `.note` files and migrates them to the new `.md` format in-place with frontmatter injected automatically.

### Improvements

- New `Accordion` and `Combobox` UI components added to the component library.
- Removed the unused `resizable.tsx` shadcn wrapper (sidebar resizing uses the custom handle added in v1.1.0).

### Breaking Changes

- **File extension changed from `.note` to `.md`**: New notes are created as `.md` files. Existing `.note` files are migrated automatically on workspace open, but any external tooling that relied on the `.note` extension will need to be updated.

### Build

- **Windows-only builds**: Linux and macOS CI builds have been temporarily disabled — they remain commented out in the release workflow and can be re-enabled once those platforms can be properly tested.

---

## v1.1.0 — Settings & Theming

### New Features

- **Settings Dialog**: A new settings panel is now accessible from the sidebar, with a tabbed layout for Appearance, Editor, General, and About sections.
- **Appearance & Theme Settings**: Choose your preferred theme (light, dark, or system) from the Appearance settings. The app now syncs with your OS theme automatically when "System" is selected.
- **Resizable Sidebar**: Drag the sidebar edge to resize it to your preferred width. The sidebar can also be fully collapsed to give your notes more space.
- **About Section**: A new About tab in Settings displays app version and other information.
- **Mermaid Diagram Theming**: Mermaid diagrams now automatically match your selected theme (light/dark) and support custom color variable overrides for advanced styling.
- **Chemical Structure (SMILES) Theming**: SMILES molecular structure diagrams now adapt to your app theme, using customizable color variables for consistent visual integration.

### Improvements

- File tree item names that exceed the sidebar width are now truncated with an ellipsis to keep the layout clean.
- Tooltips have been added to file tree items so you can always see the full name on hover.
- **Faster File Tree Loading**: The workspace file tree now reads directories in parallel.
- Toast notifications now respect your selected light/dark theme setting.
- Sidebar resizing is now implemented with a custom handle, removing the `react-resizable-panels` dependency and improving pointer interaction reliability.

### Fixes

- Fixed a flash of incorrect theme on startup — the app now applies the correct theme immediately before the first render.
- Fixed the settings dialog layout overflowing its container.
- Fixed an edge case where inline editable fields could display stale values after external updates.
- Fixed open tabs not being cleared when their corresponding note is deleted.

---

## v1.0.0 — Complete Rewrite

> Nemos v1.0.0 is a ground-up rewrite of the application. This release re-architects the core of the app, establishes the foundation for upcoming features, and introduces significant structural, architectural, performance, and UI changes.

### Highlights

- **Workspaces**: Organize your notes into separate workspaces. Each workspace has its own directory, file tree, and recent notes view.
- **Tabbed Editing**: Open multiple notes at once with a full tab system — including keyboard shortcuts (`Ctrl+Tab` / `Ctrl+Shift+Tab`), context menus, tab persistence across sessions, and the ability to open notes in new tabs from the file tree.
- **Redesigned Sidebar & File Tree**: A new sidebar with a hierarchical workspace tree, drag-and-drop for moving notes and folders, visual drop indicators, and rich context menus (rename, delete, copy, open in explorer, open in new tab).
- **Upgraded Editor (TipTap v3)**: The rich-text editor has been upgraded to TipTap v3 with new and improved extensions.

### New Features

#### Workspaces
- Workspace selector for creating and switching between workspaces
- Workspace overview page with recent notes table
- Workspace-scoped file tree with folder and note hierarchy
- Form validation for workspace creation (via React Hook Form + Zod)

#### Editor Extensions
- **Slash Commands**: Type `/` to insert headings, lists, code blocks, math, diagrams, and more — with a filterable command palette
- **Code Blocks**: Syntax highlighting (via lowlight/highlight.js) with a language selector dropdown and copy-to-clipboard button
- **Math (KaTeX)**: Inline and display math blocks with live preview
- **Mermaid Diagrams**: Render Mermaid diagrams directly in your notes
- **Chemical Structures (SMILES)**: Render molecular structures from SMILES notation with click-to-select support
- **Tables**: Interactive tables with buttons to add rows and columns
- **Resizable Images**: Resize and align images within your notes
- **Links**: Enhanced link handling with Tauri-native URL opening
- **Task Lists**: Interactive checklists with toggleable checkboxes
- **File Upload**: Drag-and-drop or paste images directly into the editor

#### Editor
- Auto-save with debounce — notes are saved automatically as you type
- Placeholder text with command hints (e.g., "Type `/` for commands") in empty blocks

#### Tabs
- Tab bar with active tab highlighting and close buttons
- Keyboard shortcuts for tab navigation
- Tab context menu (close, close others)
- Tab state persisted across sessions via Zustand middleware
- Sync between open tabs and URL navigation

#### File Operations
- Create, rename, delete, and copy notes
- Create, rename, delete, and move folders
- Drag-and-drop to move notes and folders within the workspace tree
- Delete confirmation dialogs
- Automatic unique path generation for duplicates
- "Reveal in Explorer" to open note locations in the system file manager

#### In-App Updater
- Automatic update checking with a dedicated update dialog
- Download progress tracking with a progress bar
- Download-and-install workflow

#### UI & Components
- Migrated to shadcn/ui (base-nova style) for a consistent, modern component library
- New components: Badge, Card, Progress, ScrollArea, Skeleton, Sheet, Separator, Tooltip, Table, Textarea, Empty states, Typography system, Toaster (via Sonner), Editable text fields, Input groups, Field components for forms
- Toast notifications (via Sonner) for error handling across file operations, editor actions, and workspace management — previously there were no user-facing error messages
- Dedicated error UI for editor components (e.g., Mermaid diagram render errors, SMILES parsing errors)
- Global error boundary with a user-friendly error page

### Architecture Changes

- **Routing**: Migrated to TanStack Router with file-based routing, route loaders, and pending/error states
- **Service Layer**: New `src/lib/` modules for filesystem (`fs/`), notes (`notes/`), workspaces (`workspace/`), tabs (`tabs/`), app initialization (`app/`), updater (`updater/`), and file opener (`opener/`) — each with dedicated services, schemas, error classes, and utility functions
- **State Management**: New Zustand stores for tabs, dialogs, rename state, UI (sidebar), and update state — replacing the previous monolithic store setup
- **Schema Validation**: Zod v4 for note and workspace schema validation
- **Linting & Formatting**: Migrated from ESLint + Prettier to Biome — faster, unified linting and formatting
- **Dependencies**: Upgraded TipTap v2 to v3, updated all Tauri plugins, replaced tippy.js with Floating UI, added TanStack Router, React Hook Form, Sonner, use-debounce, and Zod

### Performance

- **Lazy-loaded KaTeX**: Math rendering (KaTeX JS + CSS) is now dynamically imported only when a math node is rendered, removing ~265 KB from the initial bundle
- **Lazy-loaded Mermaid**: Mermaid core is now dynamically imported only when a diagram node is rendered, removing ~502 KB from the initial bundle
- **Lazy-loaded SMILES**: Chemical structure rendering (smiles-drawer) is dynamically imported only when a SMILES node is rendered
- **Vite manual chunks**: Configured code splitting to separate React, TipTap/ProseMirror, and highlight.js into independent cacheable vendor chunks — reducing the main bundle from ~2.3 MB to ~562 KB
- **Debounced Mermaid rendering**: Mermaid diagrams now render with debounce to avoid unnecessary re-renders while typing
- **Memoized CommandList**: Slash command palette component is memoized to prevent unnecessary re-renders

### Security

- Mermaid diagram security level changed from `loose` to `strict`
- Math node views now use `textContent` instead of `innerHTML` for safer rendering

### Temporarily Removed

> These features are planned to be re-implemented in upcoming releases.

- **Theme Provider**: The theme/appearance system has been temporarily removed
- **Note Lock**: The ability to lock notes from editing has been temporarily removed
- **Settings Modal**: The configuration/appearance modal has been removed (will be rebuilt)

### Breaking Changes

- **Notes Storage Location Changed**
  - **Before**: `Documents/Nemos/`
  - **After**: `Documents/nemos-app/<workspace>/`
  - This change enables workspace support. **There is no automatic migration.** Users must manually move their existing notes into a workspace folder under the new location.
