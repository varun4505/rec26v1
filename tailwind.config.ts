import type { Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'background-dark': '#111111', // Main outer background
        'content-dark': '#1C1C1C',   // Inner card background
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0', // Lighter grey text
        'accent-red': '#E53E3E',     // Active tab
        'accent-orange': '#D97706',  // Avatar bg
        'accent-peach': '#FFEDD5',   // Subdomain section bg
        'card-dark': '#000000',      // Subdomain cards, tabs
      },
      fontFamily: {
        sans: ["var(--font-khand)", ...theme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
