const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,vue}',
    './components/**/*.{js,jsx,vue}',
    './app/**/*.{js,jsx,vue}',
    './src/**/*.{js,jsx,vue}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        'custom': '0 0 7px 5px rgba(0, 0, 0, 0.05);',
      },
      colors: {
        'blue-main': '#0FB3AF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'Sans-serif']
      },
      padding: {
        '0.5': '0.5rem',
        '0': '0rem',
      },
      margin: {
        '0.5': '0.5rem',
        '-0.5': '-0.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui'),
    animate
  ],
  daisyui: {
    themes: [{light: {...require("daisyui/src/theming/themes")["light"], primary: "#0FB3AF"}}],
  },
}