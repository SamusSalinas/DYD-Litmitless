/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        dnd: {
          teal: '#31AAA9',
          gold: '#F8E0A4',
          red: '#A82020',
          dark: '#6C1A1A',
          bg: '#0f0f14',
          surface: '#1a1a22',
          card: '#22222e',
          border: '#2e2e3a',
        },
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
