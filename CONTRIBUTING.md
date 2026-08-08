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

## Available Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `pnpm dev`            | Start Tauri dev server (full app)                |
| `pnpm vite:dev`       | Start frontend dev server only                   |
| `pnpm build`          | Build production Tauri app                       |
| `pnpm lint`           | Run Biome linter                                 |
| `pnpm lint:fix`       | Run Biome linter with autofix                    |
| `pnpm format`         | Format code with Biome                           |
| `pnpm bump X.Y.Z`     | Bump version in `package.json` and `tauri.conf.json` |

## Branch Naming

| Branch              | Purpose                                              | Lifetime                          |
| ------------------- | ---------------------------------------------------- | --------------------------------- |
| `main`              | Integration branch — next unreleased version         | Permanent                         |
| `feat/<name>`       | Self-contained feature                               | Deleted after merge to `main`     |
| `feat/<f>/<sub>`    | Sub-issue within a larger multi-issue feature        | Deleted after merge to `feat/<f>` |
| `fix/<name>`        | Bug fix discovered before any release                | Deleted after merge to `main`     |
| `fix/vX.Y.x`        | Patch maintenance line for a released version        | Deleted after next minor ships    |

`main` carries the last released version in `package.json` until release day — it is not bumped speculatively.

Sub-branch naming under a parent feature (`feat/<f>/<sub>`) is a convention, not a requirement — name sub-branches however avoids ambiguity with other in-flight branches.

## Development Workflow

### Self-contained feature

1. Branch from `main`:
   ```sh
   git checkout -b feat/my-feature main
   ```
2. Develop, commit using [Conventional Commits](#commit-conventions).
3. Add a changelog entry before opening the final PR.
4. Open a PR to `main`. Delete the branch after merge.

### Multi-issue feature

Use a parent feature branch as an integration point:

```
main
  └── feat/my-feature          ← parent (integration)
        ├── feat/my-feature/issue-a  ← sub-branch
        └── feat/my-feature/issue-b  ← sub-branch
```

1. Branch the parent from `main`: `git checkout -b feat/my-feature main`
2. For each issue, branch from the parent, e.g. `git checkout -b feat/my-feature/issue-a feat/my-feature` — the `<sub>` naming is just a convention, use whatever reads clearly.
3. Open PRs: sub-branches → parent feature branch.
4. When all issues are merged into the parent, do a final review, add the changelog entry to the parent branch, then open a PR from the parent to `main`.
5. Delete all branches after the parent is merged.

### Pre-release bug fix

For bugs found on `main` before any release:

1. Branch from `main`: `git checkout -b fix/my-fix main`
2. Fix, commit, open PR to `main`. Delete branch after merge.

## Releasing

### Minor / Major release

Cut from `main` when the next set of features is ready.

1. Update `CHANGELOG.md` for the release by hand, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):
   ```sh
   git add CHANGELOG.md
   git commit -m "docs(changelog): update for vX.Y.0"
   ```
2. Bump the version:
   ```sh
   pnpm bump X.Y.0
   git add .
   git commit -m "chore: bump version to X.Y.0"
   ```
3. Tag and push:
   ```sh
   git tag vX.Y.0
   git push origin main --tags
   ```
4. CI builds installers and creates a **draft** GitHub Release.
5. Go to [Releases](https://github.com/USpiri/nemos/releases), review the draft, and **publish** it.
6. Delete `fix/vX.Y-1.x` if it exists (previous minor's maintenance line is now end-of-life).

### Patch release

Used when bugs are found in an already-released version. Patch releases ship **immediately** for critical bugs (crashes, data loss, broken core flows) and are **batched** for minor issues (UI glitches, cosmetic defects).

#### Step 1 — Create the maintenance line (first patch only)

```sh
git checkout -b fix/vX.Y.x vX.Y.0   # branch from the release tag, not main
git push -u origin fix/vX.Y.x
```

For subsequent patches on the same line, the branch already exists — skip this step.

#### Step 2 — Fix the bug(s)

On `fix/vX.Y.x`, commit each fix:

```sh
git commit -m "fix: <description>"
```

#### Step 3 — Update the patch changelog

Back on `fix/vX.Y.x`, add the entry for this patch by hand, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):

```sh
git add CHANGELOG.md
git commit -m "docs(changelog): add vX.Y.Z entry"
```

#### Step 4 — Bump, tag, and release

```sh
pnpm bump X.Y.Z
git add .
git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
git push origin fix/vX.Y.x --tags
```

CI builds installers and creates a draft release. Publish it on GitHub.

#### Step 5 — Merge the fix back into `main`

```sh
git checkout main
git merge fix/vX.Y.x
git push origin main
```

This carries the fix commits, changelog entry, and version bump onto `main` in one merge. `main` will now show `X.Y.Z` as its version until the next minor release bumps it further — that's fine, since `main`'s version only needs to keep moving forward, not stay pinned to `X.Y.0`.

### CI secrets

The release workflow requires these GitHub Actions secrets:

| Secret                      | Description                      |
| --------------------------- | -------------------------------- |
| `TAURI_UPDATER_PRIVATE_KEY` | Signing key for the auto-updater |
| `TAURI_UPDATER_PASSWORD`    | Password for the signing key     |

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

| Type       | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `feat`     | A new feature                                                   |
| `fix`      | A bug fix                                                       |
| `refactor` | Code change that neither fixes a bug nor adds a feature         |
| `docs`     | Documentation changes                                           |
| `style`    | Formatting, missing semicolons, etc. (no code change)           |
| `perf`     | Performance improvement                                         |
| `test`     | Adding or updating tests                                        |
| `chore`    | Build process, dependencies, or tooling changes                 |

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
