/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-highlighted': '#F3F4F6',
        'custom-purple-light': '#9B51E0',
      }
    },
  },
  plugins: [],
}