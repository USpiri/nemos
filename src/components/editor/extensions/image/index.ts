import { Image as ImageExtension } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ImageNodeView from './Image'

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageWidth: (width: string) => ReturnType
      setImageAlign: (align: 'start' | 'center' | 'end') => ReturnType
    }
  }
}

export const Image = ImageExtension.configure({
  allowBase64: true,
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: { default: 'center', renderHTML: ({ align }) => ({ align }) },
    }
  },

  addCommands() {
    return {
      setImageWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes('image', { width }),

      setImageAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes('image', { align }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})
