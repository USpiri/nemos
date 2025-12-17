import { common, createLowlight } from "lowlight";

// Highlight imports
import txt from "highlight.js/lib/languages/plaintext";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import http from "highlight.js/lib/languages/http";
import sql from "highlight.js/lib/languages/sql";
import md from "highlight.js/lib/languages/markdown";
import rust from "highlight.js/lib/languages/rust";
import java from "highlight.js/lib/languages/java";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import haskell from "highlight.js/lib/languages/haskell";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

const lowlight = createLowlight(common);

// Registers
lowlight.register("txt", txt);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("json", json);
lowlight.register("http", http);
lowlight.register("sql", sql);
lowlight.register("md", md);
lowlight.register("rust", rust);
lowlight.register("java", java);
lowlight.register("bash", bash);
lowlight.register("haskell", haskell);
lowlight.register("console", shell);

// Aliases
lowlight.registerAlias({ haskell: ["mermaid"] });
export const CodeBlock = CodeBlockLowlight.configure({ lowlight });
