/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#081229',
      },
      screens: {
        'sm': { 'max': '400px' },      // Mobile: Up to 767px
        // Large screens starting at 769px
        'tb': { 'max': '768px' },
        // Mobile: Up to 767px
        'r': { 'min': '699px', 'max': '668' },


      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',

    },
  },
  plugins: [],
};
