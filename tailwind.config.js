/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00D68F',
          600: '#00A86B',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        dark: {
          bg: '#07090F',
          bg2: '#0C101A',
          card: '#111724',
          card2: '#161E2E',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
