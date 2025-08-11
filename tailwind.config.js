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
        // Neumorphic colors
        neumorphic: {
          bg: "#e0e5ec",
          text: "#333",
          subtitle: "#777",
          accent: "#007bff",
        },
      },
      // Neumorphic shadows
      boxShadow: {
        'neumorphic': '9px 9px 18px #a7a9ac, -9px -9px 18px #ffffff',
        'neumorphic-input': 'inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff',
        'neumorphic-input-hover': 'inset 2px 2px 5px #bec3c9, inset -2px -2px 5px #ffffff',
        'neumorphic-input-error': 'inset 5px 5px 10px #f87171, inset -5px -5px 10px #fecaca',
        'neumorphic-accent-btn': '8px 8px 16px #94b5e6, -8px -8px 16px #ffffff',
        'neumorphic-accent-btn-hover': '12px 12px 24px #94b5e6, -12px -12px 24px #ffffff',
      },
    },
  },
  plugins: [],
};