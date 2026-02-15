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

![349shots_so](https://github.com/user-attachments/assets/aba352d7-106c-4103-9447-dae423bb506a)

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

![916shots_so](https://github.com/user-attachments/assets/9b1c84b4-3fd8-42b9-8dbb-4c66a9307559)

![736shots_so](https://github.com/user-attachments/assets/c9a94775-c4e6-4e53-bd73-ab8fe6075f65)

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
   pnpm tauri dev
   ```

### Building the Application

To create a production-ready Tauri build:

```sh
pnpm tauri build
```

## 🤝 Contribution Guidelines

Contributions are welcome! If you'd like to contribute:

1. **Fork** the repository.
2. **Create a new branch** for your feature or bug fix.
3. **Commit your changes** with a descriptive message.
4. **Submit a pull request** for review.

We appreciate your help in making Nemos even better!


Happy note-taking! 😊
