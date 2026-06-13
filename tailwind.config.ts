import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0a0e1a",
        "bg-secondary": "#111827",
        "bg-card": "#1a2235",
        "text-primary": "#f9fafb",
        "text-secondary": "#9ca3af",
        accent: "#f59e0b",
        "accent-hover": "#d97706",
        success: "#10b981",
        error: "#ef4444",
        border: "#2d3748",
      },
    },
  },
  plugins: [],
};
export default config;
