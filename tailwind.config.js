/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'spin-reverse': 'spin 1.5s linear infinite reverse',
      },
      colors: {
        primary: {
          50: '#FEF2F4',
          100: '#FDE6EA',
          200: '#FAC2CC',
          300: '#F69DAD',
          400: '#F27990',
          500: '#DD2444',
          600: '#C41F3D',
          700: '#A21932',
          800: '#801427',
          900: '#5E0F1D',
        },
        secondary: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#CFCFCF',
          400: '#9F9F9F',
          500: '#3C3C3C',
          600: '#363636',
          700: '#2D2D2D',
          800: '#242424',
          900: '#1B1B1B',
        }
      }
    },
  },
  plugins: [],
};