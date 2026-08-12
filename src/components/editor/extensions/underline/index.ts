import {
  Underline as UnderlineExtension,
  type UnderlineOptions,
} from '@tiptap/extension-underline'
import { markInputRule, markPasteRule } from '@tiptap/react'

const inputRegex = /(?:^|\s)(\+\+(?!\s+\+\+)((?:[^+]+))\+\+(?!\s+\+\+))$/
const pasteRegex = /(?:^|\s)(\+\+(?!\s+\+\+)((?:[^+]+))\+\+(?!\s+\+\+))/g

export const Underline = UnderlineExtension.extend<UnderlineOptions>({
  addInputRules() {
    return [
      ...(this.parent?.() ?? []),
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },

  addPasteRules() {
    return [
      ...(this.parent?.() ?? []),
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ]
  },
})
