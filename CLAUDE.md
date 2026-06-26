# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nemos is a minimalist, local-first note-taking desktop app built with **Tauri v2** (Rust backend) + **React** (TypeScript frontend). Notes are stored as `.md` files on the local filesystem under a `nemos-app` folder in the user's Documents directory. There is no database.

## Conventions

- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/) — `<type>: <description>` (e.g., `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)

## Releasing

Version is tracked in `package.json` and `src-tauri/tauri.conf.json`. Use `pnpm bump <version>` to update both. Pushing a `v*` tag triggers the CI workflow (`.github/workflows/release.yml`) that builds for Windows and creates a draft GitHub Release. See `CONTRIBUTING.md` for the full process.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `USpiri/nemos`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five canonical label strings (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
