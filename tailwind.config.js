/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-primary": "var(--background-primary)",
        "background-primary-alt": "var(--background-primary-alt)",
        "background-primary-hover": "var(--background-primary-hover)",
        "background-secondary": "var(--background-secondary)",
        "background-secondary-alt": "var(--background-secondary-alt)",
        "background-secondary-hover": "var(--background-secondary-hover)",
        "background-select": "var(--background-selection)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-faint": "var(--foreground-faint)",
        "foreground-select": "var(--foreground-selection)",
        border: "var(--border-color)",
        detail: "var(--detail)",
      },
      height: {
        topbar: "var(--topbar-height)",
      },
      typography: ({ theme }) => ({
        theme: {
          css: {
            "--tw-prose-body": "var(--prose-body)",
            "--tw-prose-headings": "var(--prose-headings)",
            "--tw-prose-lead": "var(--prose-lead)",
            "--tw-prose-links": "var(--prose-links)",
            "--tw-prose-bold": "var(--prose-bold)",
            "--tw-prose-counters": "var(--prose-counters)",
            "--tw-prose-bullets": "var(--prose-bullets)",
            "--tw-prose-hr": "var(--prose-hr)",
            "--tw-prose-quotes": "var(--prose-quotes)",
            "--tw-prose-quote-borders": "var(--prose-quote-borders)",
            "--tw-prose-captions": "var(--prose-caption)",
            "--tw-prose-code": "var(--prose-code)",
            "--tw-prose-pre-code": "var(--prose-pre-code)",
            "--tw-prose-pre-bg": "var(--prose-pre-bg)",
            "--tw-prose-th-borders": "var(--prose-th-borders)",
            "--tw-prose-td-borders": "var(--prose-td-borders)",

            code: {
              background: "var(--code-bg)",
              borderRadius: theme("borderRadius.DEFAULT"),
              fontWeight: theme("fontWeight.normal"),
              "&:not(pre code)": {
                paddingInline: theme("padding.2"),
                paddingBlock: theme("padding.1"),
              },
              "&::before": {
                display: "none",
              },
              "&::after": {
                display: "none",
              },
            },

            pre: {
              code: {
                backgroundColor: "transparent",
              },
            },

            "h1, h2, h3,h4, h5, h6": {
              fontWeight: theme("fontWeight.medium"),
            },

            blockquote: {
              fontWeight: theme("fontWeight.normal"),
              fontStyle: "unset",
              "p::before, p::after": {
                display: "none",
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
