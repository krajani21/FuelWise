/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#4CAF50',
          600: '#45a049',
          700: '#3d8b40',
        },
        secondary: {
          600: '#003366',
          700: '#002855',
          800: '#001f3f',
        }
      }
    },
  },
  plugins: [],
}
