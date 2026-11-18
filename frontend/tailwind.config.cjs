/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        wiki: {
          ink: '#26342e',
          muted: '#68756c',
          forest: '#19352b',
          'forest-light': '#315746',
          copper: '#bd7446',
          gold: '#d9b66d',
          paper: '#f3efe4',
          surface: '#fffdf8',
          line: '#e7e0d1',
        },
        dnd: {
          teal: '#19352b',
          gold: '#bd7446',
          red: '#86502f',
          dark: '#19352b',
          bg: '#f3efe4',
          surface: '#fffdf8',
          card: '#fffefa',
          border: '#e7e0d1',
        },
      },
      fontFamily: {
        serif: ['Georgia', '"Cinzel"', '"Times New Roman"', 'serif'],
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
