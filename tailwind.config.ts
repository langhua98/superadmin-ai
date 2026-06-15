import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base:       "rgb(var(--bg-base) / <alpha-value>)",
        surface:    "rgb(var(--bg-surface) / <alpha-value>)",
        hover:      "rgb(var(--bg-hover) / <alpha-value>)",
        elevated:   "rgb(var(--bg-elevated) / <alpha-value>)",
        border:     "rgb(var(--border) / <alpha-value>)",
        primary:    "rgb(var(--text-primary) / <alpha-value>)",
        muted:      "rgb(var(--text-muted) / <alpha-value>)",
        accent:     "rgb(var(--accent) / <alpha-value>)",
        "accent-fg":"rgb(var(--accent-fg) / <alpha-value>)",
        userbubble: "rgb(var(--user-bubble) / <alpha-value>)",
        "send-on":  "rgb(var(--send-active) / <alpha-value>)",
      },
      fontFamily: {
        sans:  ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono:  ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [typography],
};
export default config;
