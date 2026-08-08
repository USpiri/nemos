---
readonly: false
tags:
  - reference
  - editor-test
title: Markdown Feature Test — Text, Marks & Lists
description: Headings, inline text marks, links, blockquotes, rules, breaks and every list variant.
---
# Markdown Feature Test — Text, Marks & Lists

Reference document exercising every text-level and list-level markdown feature the Nemos editor supports. Pair with `markdown-tables-and-media.md` and `markdown-code-diagrams-math.md` for the rest.

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Text marks

Plain text, **bold text**, *italic text*, ~~strikethrough text~~, ++underlined text++, and `inline code`.

Combined marks: ***bold italic***, **bold with `inline code` inside**, ~~strikethrough with *italic* inside~~.

## Links

[Nemos repository](https://github.com/USpiri/nemos "Nemos on GitHub") — plain link with a title attribute.

Ctrl/Cmd-click a link while the note is not in edit focus to open it externally.

## Blockquotes

> A single-line blockquote.

> A multi-paragraph blockquote.
>
> Second paragraph, still quoted.
>
> > A nested blockquote inside the first one.

## Horizontal rule

Content above the rule.

---

Content below the rule.

## Hard line breaks

Line one, ending with two trailing spaces.
Line two, immediately below — should be a hard break, not a new paragraph.

## Lists

### Bullet list (with nesting)

- Top-level item
  - Nested item
    - Deeply nested item
- Top-level item with **bold** and `code`
- Top-level item with a [link](https://github.com/USpiri/nemos)

### Ordered list (with nesting)

1. First item
2. Second item
   1. Nested first
   2. Nested second
3. Third item

### Task list

- [ ] Unchecked task
- [x] Checked task
- [ ] Task with **bold**, `code`, and a [link](https://github.com/USpiri/nemos)
  - [ ] Nested unchecked subtask
  - [x] Nested checked subtask
