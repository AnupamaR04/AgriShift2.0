/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#0B1C13',
          forest: '#183B28',
          paddy: '#2A6A48',
          leaf: '#40916C',
          lightleaf: '#52B788',
          sage: '#95D5B2',
          mist: '#D8F3DC',
          cream: '#FCFAF6',
          sand: '#F3EDE2',
          earth: '#7F5539',
          terracotta: '#BC6C25',
          gold: '#DDA15E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        malayalam: ['Manjari', 'Gayathri', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(24, 59, 40, 0.06), 0 2px 6px -1px rgba(24, 59, 40, 0.04)',
        'card': '0 10px 30px -4px rgba(24, 59, 40, 0.08), 0 4px 8px -2px rgba(24, 59, 40, 0.03)',
        'float': '0 20px 40px -6px rgba(24, 59, 40, 0.12), 0 8px 16px -4px rgba(24, 59, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
