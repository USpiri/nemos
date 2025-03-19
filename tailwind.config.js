/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        theme: {
          css: {
            "--tw-prose-body": "var(--body)",
            "--tw-prose-headings": "var(--headings)",
            "--tw-prose-lead": "var(--lead)",
            "--tw-prose-links": "var(--links)",
            "--tw-prose-bold": "var(--bold)",
            "--tw-prose-counters": "var(--counters)",
            "--tw-prose-bullets": "var(--bullets)",
            "--tw-prose-hr": "var(--hr)",
            "--tw-prose-quotes": "var(--quotes)",
            "--tw-prose-quote-borders": "var(-quote-border)",
            "--tw-prose-captions": "var(--captions)",
            "--tw-prose-code": "var(--inline-code-foreground)",
            "--tw-prose-pre-code": "var(--block-code-foreground)",
            "--tw-prose-pre-bg": "var(--block-code-background)",
            "--tw-prose-th-borders": "var(--th-borders)",
            "--tw-prose-td-borders": "var(--td-borders)",

            code: {
              background: "var(--inline-code-background)",
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
};
