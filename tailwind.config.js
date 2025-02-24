/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))", // Definindo uma grid com 13 colunas
        14: "repeat(14, minmax(0, 1fr))", // Definindo uma grid com 13 colunas
        15: "repeat(15, minmax(0, 1fr))",
      },
      fontFamily: {
        Anton: ["Anton", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
