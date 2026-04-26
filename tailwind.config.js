/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        cream: '#BDB8B0',
        charcoal: '#0F0E0C',
        blush: '#6B1818',
        muted: '#5A5650',
        sage: '#6B7B5E',
      },
    },
  },
  plugins: [],
};
