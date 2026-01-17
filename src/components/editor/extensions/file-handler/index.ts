import { FileHandler as FileHandlerExtension } from '@tiptap/extension-file-handler'

export const FileHandler = FileHandlerExtension.configure({
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  onDrop: (currentEditor, files, pos) => {
    files.forEach((file) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        currentEditor
          .chain()
          .insertContentAt(pos, {
            type: 'image',
            attrs: {
              src: fileReader.result,
            },
          })
          .focus()
          .run()
      }
    })
  },
})
