# ✍🏻 Nemos | Minimalist Note-Taking App

<p align="center">
  <img src="https://raw.githubusercontent.com/USpiri/nemos/refs/heads/main/icon.png" alt="Things shop icon" width="100" />
  <br>
  <em>A minimalist, private, and customizable note-taking app.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  &nbsp;
  <img src="https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF" />
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  &nbsp;
  <img src="https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white" />
</p>

<p align="center">
  <strong><a href="https://github.com/USpiri/nemos/releases/latest" target="_blank">Download here</a></strong>
</p>

## About Nemos η

Nemos is an intuitive and easy-to-use note-taking application designed to help users focus on capturing and organizing their thoughts without distractions. Most of its features seamlessly integrate into the text, providing a smooth and immersive writing experience.

<img width="1920" height="1440" alt="257shots_so" src="https://github.com/user-attachments/assets/ddbc570b-f125-4aae-b343-a89282064179" />

### ✨ Key Features

- **Workspaces**: Organize your notes into separate workspaces, each with its own directory, file tree, and recent notes view.
- **Tabbed Editing**: Open multiple notes at once with keyboard shortcuts, context menus, and tab persistence across sessions.
- **Rich Text Editor** (TipTap v3): Headings, paragraphs, bold, italics, quotes, inline code, strikethrough, underline, task lists, and more.
- **Advanced Editor Extensions**:
  - **Slash Commands**: Type `/` to insert headings, lists, code blocks, math, diagrams, and more.
  - **Code Blocks**: Language selector, syntax highlighting, and copy button.
  - **Diagrams**: Integrated Mermaid.js support.
  - **Mathematical Notation**: Inline and display math with KaTeX.
  - **Chemical Notation**: Support for SMILES chemical structures.
  - **Resizable Images**: Drag to resize and align images.
  - **Tables**: Interactive tables with add row/column buttons.
  - **File Upload**: Drag-and-drop or paste images directly into the editor.
- **File Tree with Drag & Drop**: Hierarchical workspace tree with drag-and-drop for moving notes and folders, context menus, and "Reveal in Explorer".
- **Auto-Save**: Notes are saved automatically as you type.
- **In-App Updates**: Automatic update checking with download progress tracking.
- **Local-First**: No cloud storage—your notes stay on your device.

## 🖼️ Screenshoots

<img width="1920" height="1440" alt="484shots_so" src="https://github.com/user-attachments/assets/8826fb80-2bc7-471a-b89f-7469447b613e" />
<img width="1920" height="1440" alt="884shots_so" src="https://github.com/user-attachments/assets/ebecb8fb-1a28-4b27-b554-b555e95770a3" />

## 🛠️ Tech Stack

- **Framework**: Tauri v2 + React 19 (Vite).
- **Language**: TypeScript.
- **Routing**: TanStack Router (file-based).
- **Editor**: TipTap v3.
- **Database**: None! Notes are stored locally as `.note` files.
- **State Management**: Zustand.
- **Styling**: Tailwind CSS v4 + shadcn/ui.
- **Linting & Formatting**: Biome.

## 📂 Project Structure

```
src/
├── components/                    # UI Components
|   ├── editor/                    # Editor & extensions
|   ├── layout/                    # Layout components (sidebar, topbar)
|   ├── tabs/                      # Tab bar components
|   ├── ui/                        # shadcn/ui components
|   └── workspace-tree/            # Workspace file tree
├── config/                        # Configuration & constants
├── hooks/                         # Domain-specific hooks (CRUD, navigation)
├── lib/                           # Service layer
|   ├── app/                       # App initialization
|   ├── editor/                    # Editor utilities
|   ├── fs/                        # Filesystem abstraction
|   ├── notes/                     # Note reading/writing & schemas
|   ├── opener/                    # File & URL opener
|   ├── tabs/                      # Tab utilities
|   ├── updater/                   # In-app updater service
|   └── workspace/                 # Workspace management & tree building
├── routes/                        # TanStack Router file-based routes
├── store/                         # Zustand stores (tabs, dialogs, UI, etc.)
├── types/                         # Type definitions
├── index.css                      # Global styles
└── main.tsx                       # Application entry point

src-tauri/                         # Tauri backend
├── capabilities/                  # App permissions
├── icons/                         # App icon
├── src/                           # Rust code
└── tauri.conf.json                # Tauri configuration
```

## 🚀 Getting Started

To set up a development environment for Nemos, ensure you have the required [Tauri prerequisites](https://tauri.app/start/prerequisites/) installed.

### Development Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/USpiri/nemos.git
   ```
2. Navigate to the project directory:
   ```sh
   cd nemos
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```
4. Start the Tauri development server:
   ```sh
   pnpm dev
   ```

### Building the Application

To create a production-ready Tauri build:

```sh
pnpm build
```

## 📦 Releasing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full release process.

Quick reference:

```sh
pnpm bump <version>       # Update version in all config files
git add .
git commit -m "chore: bump version to <version>"
git tag v<version>
git push origin main --tags
```

Pushing a `v*` tag triggers the CI workflow that builds for macOS, Linux, and Windows, then creates a draft GitHub Release.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.


Happy note-taking! 😊
