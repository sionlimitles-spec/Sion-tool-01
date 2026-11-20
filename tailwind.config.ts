import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#000000",
          white: "#FFFFFF",
          cream: "#F5F0E6",
          yellow: "#FFEB3B",
          cyan: "#00BCD4",
          pink: "#FF4081",
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
      },
      fontFamily: {
        display: ['var(--font-archivo)'],
        body: ['var(--font-grotesk)'],
      }
    },
  },
  plugins: [],
};
export default config;
