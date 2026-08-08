# ADR 0001 — Release and Patch Workflow

**Date:** 2026-06-25
**Status:** Accepted

## Context

Nemos ships as a versioned desktop app. After tagging `v1.1.0`, a bug was found while `main` already contained unreleased 1.2.0 features. The steps to isolate the fix and ship a patch without releasing the new features were unclear. We needed a documented, repeatable workflow covering features, patches, and multiple release lines.

## Decision

### Branch model

- `main` is the permanent integration branch for the *next unreleased* version.
- Feature work lands on `main` via `feat/<name>` branches (short-lived, deleted after merge).
- Multi-issue features use a parent feature branch (`feat/<feature>`) with sub-branches. Sub-branch naming (`feat/<feature>/<sub>`) is a convention for clarity, not a strict requirement — any naming that avoids ambiguity with other branches works. The changelog entry rides in with the parent feature PR.
- Pre-release bug fixes use `fix/<name>` branches, merged to `main` and deleted.
- `main` carries the last released version in `package.json` until release day.

### Patch maintenance lines

- `fix/vX.Y.x` is created **reactively** from the release tag when the first bug surfaces: `git checkout -b fix/vX.Y.x vX.Y.0`.
- It is **deleted after the next minor version ships** — not immediately after the last patch.
- Patch release trigger: **immediately** for critical bugs (crashes, data loss, broken core flows); **batched** for minor issues (UI glitches, cosmetic defects).

### Back-porting fixes to `main`

Fixes are authored on the maintenance line and **merged into `main`** once the patch has shipped — the whole `fix/vX.Y.x` branch state (fix commits, changelog entry, version bump) lands in a single merge, not commit-by-commit cherry-picks.

This is safe because `main`'s version only needs to move forward, not stay pinned to `X.Y.0`. Merging a patch bump (`X.Y.Z`) onto `main` while it's tracking `X.Y.0` just advances the number; the eventual minor bump (`X.(Y+1).0`) still supersedes it cleanly. There's no real version conflict to avoid, so cherry-picking commit-by-commit was solving a problem that didn't exist — it only added the overhead of tracking SHAs per fix. The one thing worth watching: if `main` already has changelog entries for unreleased features, the patch's changelog insertion can produce a small `CHANGELOG.md` merge conflict, resolved by keeping both sets of entries in chronological order.

### Changelog

Changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Entries are written by hand for each release and patch — there is no automated changelog generation tool wired into the project.

## Alternatives considered

- **Cherry-pick instead of merge**: the original plan, on the assumption that merging would drag the patch's version-bump commit onto `main` and conflict with `main` tracking the next unreleased version. That conflict doesn't actually materialize (see above), so this was dropped in favor of a plain merge after the patch releases.
- **Fix on `main` first, cherry-pick down**: Natural for teams where `main` is the enforced review gate. Adds friction for a solo/small team where urgency flows toward the patch branch.
- **Proactive patch branches** (created at every release): Adds noise for releases that never need a patch. Tags already preserve the snapshot; the branch only matters when fixes are needed.
- **Automated changelog generation (e.g. git-cliff)**: Considered, but not currently set up in the repo. Changelog entries are written by hand for now.
