import { Buffer } from 'buffer'

// gray-matter (via kind-of) calls `Buffer.from` unconditionally, which only
// exists as a real global in Node. Vite's dev server shims it in via
// optimizeDeps' esbuild plugin, but that shim never reaches the production
// build, so every packaged app needs this polyfilled explicitly.
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}
