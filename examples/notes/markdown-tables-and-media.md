---
readonly: false
tags:
  - reference
  - editor-test
title: Markdown Feature Test — Tables & Images
description: GFM tables (with alignment) and image embedding, including custom align/width attributes.
---
# Markdown Feature Test — Tables & Images

Reference document exercising the table and image nodes. See `markdown-text-and-lists.md` for text/list features and `markdown-code-diagrams-math.md` for code, diagrams and math.

## Tables

### Basic table

| Field    | Value          |
| -------- | -------------- |
| Registry | ISC-CS-07      |
| Status   | Operational    |

### Column alignment

GFM alignment markers (`:---`, `:---:`, `---:`) control per-column text alignment.

| Left         |    Center    |        Right |
| :----------- | :----------: | -----------: |
| a            |      b       |            c |
| longer cell  |      x       |            y |

### Formatting inside cells

| Feature      | Example                              |
| ------------ | ------------------------------------- |
| Bold         | **bold text**                         |
| Code         | `inline code`                         |
| Link         | [Nemos](https://github.com/USpiri/nemos) |
| Combined     | **bold** and `code` and *italic*      |

## Images

Standard markdown image (default alignment/width):

![Placeholder alt text](./placeholder.png "Optional image title")

Custom alignment and width — Nemos renders these as raw `<img>` tags in markdown when alignment/width differ from the default, so the editor round-trips them correctly:

<img src="./placeholder.png" alt="Centered, resized image" align="center" width="300" />

> Replace `./placeholder.png` with a real image path (or drag-and-drop / paste an image into the editor) to test rendering, resize handles, and the align-start/center/end controls.
