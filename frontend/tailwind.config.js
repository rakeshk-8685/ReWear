/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          dark: '#070a12',
          surfaceDark: '#121827',
          cardDark: '#1a2234',
          light: '#f8fafc',
          cardLight: '#ffffff',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#b6f4c7',
          300: '#76e99b',
          400: '#34d36f',
          500: '#10b981', // iOS System Emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          violet: '#8b5cf6',
          pink: '#ec4899',
          amber: '#f59e0b',
          sky: '#0ea5e9',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Roboto', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'apple-ambient': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'apple-elevated': '0 30px 60px -12px rgba(0, 0, 0, 0.16)',
        'apple-glass': '0 10px 30px 0 rgba(0, 0, 0, 0.12)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.35)',
      },
      backdropBlur: {
        'ultra': '40px',
        'apple': '25px',
      },
    },
  },
  plugins: [],
}
