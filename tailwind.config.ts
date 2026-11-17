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
        surface: {
          950: "#070b14",
          900: "#0d1322",
          800: "#151e33",
        },
        accent: {
          cyan: "#22d3ee",
          emerald: "#34d399",
          indigo: "#818cf8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
