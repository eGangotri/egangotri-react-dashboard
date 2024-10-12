/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        // slab: ['Roboto Slab', 'serif'],
        // sans: ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        turquoise: {
          50: '#E0F7F7',
          100: '#B3EBEB',
          200: '#80DEDE',
          300: '#4DD1D1',
          400: '#26C7C7',
          500: '#00BDBD',
          600: '#00A5A5',
          700: '#008888',
          800: '#006B6B',
          900: '#004F4F',
        },
      },
    },
  },
  plugins: [],
}

