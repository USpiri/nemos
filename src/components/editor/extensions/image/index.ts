import { Image as ImageExtension } from '@tiptap/extension-image'

export const Image = ImageExtension.configure({
  allowBase64: true,
})
