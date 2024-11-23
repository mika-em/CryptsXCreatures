/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      extend: {
        fontFamily: {
          sans: ['Open Sans'],
          title: ['Silkscreen', 'cursive'], 
          body: ['Open Sans', 'sans-serif'],
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark', 'dracula'],
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
  },
};
