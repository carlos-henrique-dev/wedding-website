/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'callem-script': ['"Callem Script"', 'cursive'],
        'eb-garamond': ['"EB Garamond"', 'serif'],
        arapey: ['"Arapey"', 'serif'],
      },
      colors: {
        primary: '#B36F46',
        'primary-light': '#EFB48F',
        'primary-dark': '#713723',
        'white-90': 'rgba(255, 255, 255, 0.9)',
      },
    },
  },
  plugins: [],
}
