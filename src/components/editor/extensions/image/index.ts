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

  renderMarkdown(node) {
    const { src, alt, title, align, width } = node.attrs as {
      src: string
      alt?: string
      title?: string
      align?: 'start' | 'center' | 'end'
      width?: string
    }

    const altText = alt || ''
    const titlePart = title ? ` "${title}"` : ''

    if ((align && align !== 'center') || width) {
      const alignAttr = align ? ` align="${align}"` : ''
      const widthAttr = width ? ` width="${width}"` : ''
      return `<img src="${src}" alt="${altText}"${alignAttr}${widthAttr} />`
    }

    return `![${altText}](${src}${titlePart})`
  },
})
