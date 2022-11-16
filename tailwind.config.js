/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'card': 'Helvetica'
    },
    extend: {
      boxShadow: {
        'card': '0 5px 10px 0 rgba(241, 242, 250, 1)',
        'dropdown': '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      colors: {
        'light-blue': '#0981c3'
      }
    },
  },
  plugins: [],
};
