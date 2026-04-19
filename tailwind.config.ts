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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand colors
        "bjp-orange": "#f76223",
        "bjp-orange-dark": "#e25216",
        "bjp-green": "#01a650",
        "bjp-border": "#c67c25",
        "bjp-cream": "#fed3a0",
        "bjp-peach": "#f6c285",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        "noto-bengali": ["var(--font-noto-bengali)", "sans-serif"],
      },
      maxWidth: {
        form: "402px",
      },
    },
  },
  plugins: [],
};

export default config;
