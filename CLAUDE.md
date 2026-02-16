# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nemos is a minimalist, local-first note-taking desktop app built with **Tauri v2** (Rust backend) + **React 19** (TypeScript frontend). Notes are stored as `.note` files on the local filesystem under a root directory called `nemos-app` (in the OS app data directory). There is no database.

## Commands

- **Dev server (frontend only):** `pnpm vite:dev`
- **Tauri dev (full app with Rust backend):** `pnpm dev`
- **Build frontend:** `pnpm vite:build` (runs `tsc -b && vite build`)
- **Build Tauri app:** `pnpm build`
- **Lint:** `pnpm lint` (Biome)
- **Lint + autofix:** `pnpm lint:fix`
- **Format:** `pnpm format`
- **Bump version:** `pnpm bump <version>` (updates `package.json`, `src-tauri/tauri.conf.json`)

No test framework is configured.

## Architecture

### Frontend (`src/`)

- **Framework:** React 19 with Vite 7 and SWC
- **Routing:** TanStack Router with file-based routing. Route files live in `src/routes/`. The route tree is auto-generated at `src/lib/generated/routeTree.gen.ts` — do not edit manually.
- **Editor:** TipTap v3 rich-text editor with custom extensions (codeblock with syntax highlighting, math/KaTeX, Mermaid diagrams, SMILES chemical structures, image resize, slash commands, tables, link handling, file upload). Extensions are in `src/components/editor/extensions/`.
- **State management:** Zustand stores in `src/store/` (tabs, UI, dialogs, rename, update). Tabs store uses `zustand/middleware/persist` to survive reloads.
- **Styling:** Tailwind CSS v4 with shadcn/ui components (base-nova style). Path alias: `@/` maps to `src/`.
- **UI components:** shadcn/ui in `src/components/ui/`, app components alongside features.

### Key route structure

```
/                           → Redirects to last visited route or /workspace
/workspace                  → Workspace selector (list/create workspaces)
/workspace/$workspaceId     → Workspace layout with sidebar + topbar + tabs
/workspace/$workspaceId/notes/$noteId → Note editor view
```

Route co-located components use the `-components` directory convention (e.g., `routes/workspace/-components/`).

### Service layer (`src/lib/`)

- `src/lib/fs/` — Filesystem abstraction over `@tauri-apps/plugin-fs` (CRUD operations, path helpers)
- `src/lib/notes/` — Note reading/writing, schema validation (Zod)
- `src/lib/workspace/` — Workspace management (listing, tree building)
- `src/lib/tabs/` — Tab type definitions and creation utilities
- `src/lib/app/` — App initialization (ensures root directory exists)
- `src/lib/editor/` — Editor-related utilities

### Backend (`src-tauri/`)

The Rust backend is thin — it registers Tauri plugins (fs, process, opener, updater, logging) and has no custom commands. All business logic runs on the frontend using Tauri's plugin APIs.

### Custom hooks (`src/hooks/`)

Domain-specific hooks for CRUD operations: `use-create-note`, `use-delete-note`, `use-rename-note`, `use-create-folder`, etc. These compose the service layer with store updates and navigation.

## Conventions

- **Package manager:** pnpm (workspace configured in `pnpm-workspace.yaml`)
- **Linter/formatter:** Biome (not ESLint/Prettier). Config in `biome.json`. Single quotes, no semicolons, trailing commas, 2-space indent, LF line endings.
- **Path alias:** `@/` resolves to `src/` (configured in both `tsconfig.json` and `vite.config.ts`)
- **File extension for notes:** `.note` (constant in `src/config/constants.ts`)
- **Icon library:** Lucide React
- **Schema validation:** Zod v4
- **Forms:** React Hook Form with `@hookform/resolvers` for Zod integration
- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/) — `<type>: <description>` (e.g., `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)

## Releasing

Version is tracked in `package.json` and `src-tauri/tauri.conf.json`. Use `pnpm bump <version>` to update both. Pushing a `v*` tag triggers the CI workflow (`.github/workflows/release.yml`) that builds for macOS, Linux, and Windows and creates a draft GitHub Release. See `CONTRIBUTING.md` for the full process.
