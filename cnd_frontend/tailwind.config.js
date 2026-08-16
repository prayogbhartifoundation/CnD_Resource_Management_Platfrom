import lineClamp from '@tailwindcss/line-clamp'
// import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
  keyframes: {
    marquee: {
      '0%': { transform: 'translateX(100%)' },
      '100%': { transform: 'translateX(-100%)' },
    },
  },
  animation: {
    marquee: 'marquee 30s linear infinite',
  },
},
  },
  plugins: [lineClamp /*, daisyui */],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
};
