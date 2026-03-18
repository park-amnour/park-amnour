/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2D6A4F',
        'light-green': '#52B788',
        'accent-gold': '#D4A017',
        'water-blue': '#1B4F72',
        'sky-blue': '#AED6F1',
        'earth-brown': '#7D5A4F',
        'cream': '#F9F5E7',
        'text-dark': '#1A1A2E',
        'text-light': '#FFFFFF',
      },
      fontFamily: {
        'hindi-hero': ['"Tiro Devanagari Hindi"', 'serif'],
        'heading': ['"Playfair Display"', 'serif'],
        'title': ['Poppins', 'sans-serif'],
        'body': ['Hind', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

