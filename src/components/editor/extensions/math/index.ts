import { Extension } from "@tiptap/react";
import { MathDisplay } from "./math-display";
import { MathInline } from "./math-inline";

export const Math = Extension.create({
  name: "math",
  addExtensions() {
    return [MathDisplay, MathInline];
  },
});
