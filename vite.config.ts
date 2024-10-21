import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    strictPort: true,
    host: host || false,
    port: 5173,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5173,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target:
      // @ts-expect-error process is a nodejs global
      process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",

    // @ts-expect-error process is a nodejs global
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,

    // @ts-expect-error process is a nodejs global
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
