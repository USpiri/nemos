# Contributing to Nemos

Thanks for your interest in contributing to Nemos!

## Getting Started

1. Fork and clone the repository
2. Install [Tauri prerequisites](https://tauri.app/start/prerequisites/)
3. Install dependencies:
   ```sh
   pnpm install
   ```
4. Start the dev server:
   ```sh
   pnpm dev
   ```

## Development Workflow

1. Create a branch from `main` for your feature or fix
2. Make your changes
3. Run the linter before committing:
   ```sh
   pnpm lint:fix
   ```
4. Commit using [Conventional Commits](#commit-conventions)
5. Open a pull request against `main`

## Available Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start Tauri dev server (full app)    |
| `pnpm vite:dev`  | Start frontend dev server only       |
| `pnpm build`     | Build production Tauri app           |
| `pnpm lint`      | Run Biome linter                     |
| `pnpm lint:fix`  | Run Biome linter with autofix        |
| `pnpm format`    | Format code with Biome               |
| `pnpm bump X.Y.Z`| Bump version in all config files    |

## Releasing

### Version files

The app version is tracked in three files:

- `package.json`
- `src-tauri/tauri.conf.json`

Use the bump script to update all three at once:

```sh
pnpm bump <version>
```

### Release process

1. Bump the version:
   ```sh
   pnpm bump 1.0.0
   ```
2. Commit the version change:
   ```sh
   git add .
   git commit -m "chore: bump version to 1.0.0"
   ```
3. Create a tag matching the version:
   ```sh
   git tag v1.0.0
   ```
4. Push the branch and tag:
   ```sh
   git push origin main --tags
   ```
5. The CI workflow (`.github/workflows/release.yml`) will build for macOS (ARM + Intel), Linux, and Windows, then create a **draft** GitHub Release with all installers attached.
6. Go to the [Releases](https://github.com/USpiri/nemos/releases) page, review the draft, edit the release notes, and **publish** it.

### CI secrets

The release workflow requires these GitHub Actions secrets:

| Secret                       | Description                              |
| ---------------------------- | ---------------------------------------- |
| `TAURI_UPDATER_PRIVATE_KEY`  | Signing key for the auto-updater         |
| `TAURI_UPDATER_PASSWORD`     | Password for the signing key             |

Generate a key pair with:

```sh
pnpm tauri signer generate -w ~/.tauri/nemos.key
```

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Each commit message should be structured as:

```
<type>(optional scope): <description>
```

### Types

| Type       | Description                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs`     | Documentation changes                            |
| `style`    | Formatting, missing semicolons, etc. (no code change) |
| `perf`     | Performance improvement                          |
| `test`     | Adding or updating tests                         |
| `chore`    | Build process, dependencies, or tooling changes  |

### Examples

```
feat: add slash command for inserting tables
fix: prevent tab from closing without saving
refactor: simplify KaTeX integration
docs: update contributing guidelines
chore: bump version to 1.0.0
```

## Code Style

- **Linter/formatter:** Biome (not ESLint/Prettier)
- Single quotes, no semicolons, trailing commas
- 2-space indentation, LF line endings
- **Icon library:** Lucide React
- **Path alias:** `@/` resolves to `src/`
