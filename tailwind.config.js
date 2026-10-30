/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { satoshi: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: { ink: '#1d1a16', coal: '#23201c', frame: '#5b5856' },
    },
  },
  plugins: [],
}
