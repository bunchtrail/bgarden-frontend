/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        black: '#000000',
        primary: {
          DEFAULT: '#0071e3',
          50: '#e6f0fd',
          100: '#cce1fb',
          200: '#99c4f7',
          300: '#66a6f3',
          400: '#3388ef',
          500: '#0071e3',
          600: '#005ab6',
          700: '#004388',
          800: '#002d5b',
          900: '#00162d',
        },
        secondary: {
          DEFAULT: '#86868b',
          light: '#f5f5f7',
          dark: '#1d1d1f',
        },
      },
      borderRadius: {
        pill: '980px',
      },
      boxShadow: {
        apple:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        card: '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
