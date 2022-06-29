const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#FDE0D2",
          100: "#FCD2BE",
          200: "#FAB798",
          300: "#F89C71",
          400: "#F6814A",
          500: "#F46623",
          600: "#D44B0B",
          700: "#9F3808",
          800: "#692505",
          900: "#341203",
        },
        lightorange: {
          50: "#FFFAF5",
          100: "#FFF1E0",
          200: "#FFDFB7",
          300: "#FFCD8F",
          400: "#FFBA66",
          500: "#FFA83D",
          600: "#FF8F05",
          700: "#CC7000",
          800: "#945100",
          900: "#5C3300",
        },
      },
      fontFamily: {
        alfa: ["Alfa Slab One", "cursive"],
      },
      spacing: {
        18: "4.5rem",
        112: "28rem",
        120: "30rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-radix")(),
    require("@tailwindcss/line-clamp"),
  ],
};
