/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef3c7',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          900: '#713f12',
        }
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}