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
        tb: { max: '768px' }, // Custom small breakpoint
        sm: { max: '400px' }, // Ultra-small devices
        
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
