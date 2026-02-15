# Changelog

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
