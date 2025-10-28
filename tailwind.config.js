/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'myura-green': {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5d0',
          300: '#8dd1b3',
          400: '#56b590',
          500: '#339970',
          600: '#267d5a',
          700: '#206349',
          800: '#1d503c',
          900: '#1a4233',
        },
        'myura-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}