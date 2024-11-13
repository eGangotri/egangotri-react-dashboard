/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'red-yellow-gradient': 'linear-gradient(to right, red, yellow)',
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        // slab: ['Roboto Slab', 'serif'],
        // sans: ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        'red-yellow-gradient-color': 'linear-gradient(to right, red, yellow)',
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
        'custom-yellow': {
          50: '#F7FBE0',
          100: '#EFF7B3',
          200: '#E6F280',
          300: '#DEED4D',
          400: '#D7E726',
          500: '#DFFF00', // Original color
          600: '#C7E500',
          700: '#A5C200',
          800: '#838F00',
          900: '#616B00',
        },
      },
    },
  },
  plugins: [],
}

