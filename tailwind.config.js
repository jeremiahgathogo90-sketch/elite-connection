export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#2D6A4F',
          dark: '#1B4332',
          light: '#52B788',
          pale: '#D8F3DC',
        },
        yellow: {
          primary: '#F4D000',
          dark: '#B8860B',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}