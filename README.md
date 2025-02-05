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

- **Minimalist & Customizable**: Simple and extensive customization options. Including custom color schemes and light/dark mode.
- **Standard Editor Features**: Headings, paragraphs, bold, italics, quotes, inline code, strikethrough, underline.
- **Advanced & Custom Editor Features**:
  - **Code Blocks**: Language selector, syntax highlighting, and copy button.
  - **Diagrams**: Integrated Mermaid.js support.
  - **Mathematical Notation**: Inline and display math with KaTeX.
  - **Chemical Notation**: Support for SMILES chemical structures.
  - **Resizable Images**: Drag to adjust image size.
  - **File Handling**: Direct image uploads and embedding.
  - **Slash Command Menu**: Quickly access editor features with `/` commands.
  - **Drag & Drop Nodes**: Easily rearrange content blocks.
- **File Tree Navigation**: Organize your notes effectively.
- **Note Properties**: Customize metadata and styling for each note (coming soon).
- **Local-First**: No cloud storage—your notes stay on your device.

## 🖼️ Screenshoots

## 🛠️ Tech Stack

- **Framework**: Tauri + React (Vite).
- **Language**: TypeScript.
- **Database**: None! Notes are stored locally.
- **State Management**: Zustand.
- **Styling**: Tailwind CSS.

## 📂 Project Structure

```
.git/                              # Git workflow and build
dist/                              # Frontend build output

src/
├── app/                           # App routing
├── components/                    # UI Components
|   ├── editor/                    # Editor
|   |   ├── extensions/            # Editor extensions
|   |   └── Editor.tsx
|   ├── ui                         # ShadCN UI components
|   └── ...
├── config/                        # Configuration files
├── hooks/                         # Global hooks
├── models/                        # Types & interfaces
├── store/                         # Zustand global state
├── utils/                         # Utility functions
├── style.css                      # Global styles
└── main.tsx                       # Application entry point

src-tauri/                         # Tauri backend
├── capabilities/                  # App permissions
├── icons/                         # App icon
├── src/                           # Rust code
└── tauri.conf.json                # Tauri configuration

...                                # Config files (package.json, etc.)
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

To create a production-ready build:

```sh
pnpm build
```

## 🤝 Contribution Guidelines

Contributions are welcome! If you'd like to contribute:

1. **Fork** the repository.
2. **Create a new branch** for your feature or bug fix.
3. **Commit your changes** with a descriptive message.
4. **Submit a pull request** for review.

We appreciate your help in making Nemos even better!


Happy note-taking! 😊
