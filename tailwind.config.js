/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#69C9D0',
        dark: '#010101',
        card: '#111111',
        border: '#222222',
      },
    },
  },
  plugins: [],
}
