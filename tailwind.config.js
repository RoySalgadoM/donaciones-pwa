/** @type {import('tailwindcss').Config} */
import tailwindcssAnimated from "tailwindcss-animated";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--color-primary),1)",
        secondary: "rgba(var(--color-secondary),1)",
        secondary2: "rgba(var(--color-secondary-700),1)",
        input: "rgb(var(--color-input))",
        inputHover: "rgb(var(--color-hover-input))",
        htable: "rgb(var(--color-htable))",

        danger: "rgb(var(--color-danger))",
        info: "rgb(var(--color-info))",
        positive: "rgb(var(--color-positive))",
        warning: "rgb(var(--color-warning))",
      },
      borderWidth: {
        DEFAULT: "0.5px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      keyframes: {
        slideDown: {
          "0%": {
            transform: "translateY(-10%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(10%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0%)",
            opacity: 1,
          },
        },
        slideLeft: {
          "0%": {
            transform: "translateX(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        growDown: {
          "0%": {
            transform: "scaleY(0)",
            "transform-origin": "top center"
          },
          "80%": {
            transform: "scaleY(1.1)",
            "transform-origin": "top center"
          },
          "100%": {
            transform: "scaleY(1)",
            "transform-origin": "top center"
          },
        },
      },
      animation: {
        "slide-down": "slideDown 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-in-out",
        "slide-left": "slideLeft 0.4s ease-in-out",
        "grow-down": "growDown 0.3s ease-in-out forwards",
      },
      fontFamily: {
        'sans': ['FuturaPTBook', 'system-ui',],
        'title': ['FuturaPTMedium','"Open Sans"',],
      },
      fontSize: {
        xxs: '0.60rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'opacity'],
    },
  },
  plugins: [tailwindcssAnimated],
};
