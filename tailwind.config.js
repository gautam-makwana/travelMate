// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import defaultConfig from "tailwindcss/defaultConfig.js";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [defaultConfig],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...colors,
        primary: "#06b6d4",
        secondary: "#8b5cf6",
        accent: "#f43f5e",
      },
    },
  },
  plugins: [],
};
