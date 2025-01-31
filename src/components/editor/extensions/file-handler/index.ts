import { FileHandlerExtension } from "./file-handler-extension";

export const FileHandler = FileHandlerExtension.configure({
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  onDrop: (editor, files, pos) => {
    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        editor
          .chain()
          .insertContentAt(pos, {
            type: "image",
            attrs: {
              src: fileReader.result,
            },
          })
          .focus()
          .run();
      };
    });
  },
});
