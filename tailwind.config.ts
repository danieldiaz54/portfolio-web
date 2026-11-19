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
        paper: "#F7F7F5",
        plate: "#FFFFFF",
        ink: "#0A0A0A",
        graphite: "#3F3F46",
        hairline: "#E4E4E7",
        gallery: "#0044CC",
        live: "#15803D",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Archivo", "sans-serif"],
        body: ["var(--font-hanken)", "Hanken Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
