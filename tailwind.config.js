/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        "foreground-darker": "rgb(var(--foreground-darker))",
        border: "rgb(var(--border-color))",
        detail: "rgb(var(--detail))",
      },
      height: {
        topbar: "var(--topbar-height)",
      },
    },
  },
  plugins: [],
};
