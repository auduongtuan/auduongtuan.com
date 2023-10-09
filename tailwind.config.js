const plugin = require("tailwindcss/plugin");

module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        tall: { raw: "(min-height: 960px)" },
      },
      fontFamily: {
        // "display": ['Work Sans', ],
        display: ["var(--main-font)", "Helvetica", "Arial", "sans-serif"],
        sans: ["var(--main-font)", "Helvetica", "Arial", "sans-serif"],
        // "script": ['Nanum Pen Script', 'IBM Plex Sans', 'Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        // '6xl': '3.375rem',
        // '7xl': '4rem'
      },
      backgroundImage: {
        colorful:
          "linear-gradient(100.21deg, #E3EAF6 18.6%, #DDEFFF 31.32%, #E9F1FF 45.95%, #F7F5FF 60.25%, #E0F0E8 79.65%)",
        "white-fade":
          "linear-gradient(180deg, #FFFFFF 47.4%, rgba(255, 255, 255, 0) 100%)",
        "dark-fade":
          "linear-gradient(180deg, rgb(32, 32, 32) 47.4%, rgba(32, 32, 32, 0) 100%)",
      },
      zIndex: {
        modal: 1000,
        popup: 1001,
      },
      backgroundColor: ({ theme }) => ({
        surface: theme.colors.white,
      }),
      textColor: ({ theme }) => ({
        onaccent: theme.colors.white,
        primary: theme.colors.gray[800],
        secondary: theme.colors.gray[600],
      }),
      borderColor: ({ theme }) => ({
        control: theme.colors.gray[200],
      }),
      colors: ({ theme }) => ({
        accent: theme.colors.blue[600],
        "accent-subtle": theme.colors.blue[200],
        "accent-subtlest": theme.colors.blue[50],
        "custom-neutral": {
          // 900: "#202020"
          900: "#1b1d22",
        },
        "dark-blue": {
          900: "#050F32",
        },
        "dark-header": {
          900: "hsl(230, 82%, 10%)",
        },
      }),
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "slide-in-fast": "slide-in 200ms ease-in forwards",
        "fade-in-fast": "fade-in 400ms ease-in-out forwards",
        "spin-slow": "spin 3s linear infinite",
      },
      animationDelay: {
        450: "450ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animation-delay"),
    require("@headlessui/tailwindcss"),
    plugin(({ addUtilities, e, theme, variants }) => {
      Object.entries(theme("gap")).forEach(([key, value]) =>
        addUtilities(
          {
            [`.flex-gap-${e(key)}`]: {
              marginTop: `-${value}`,
              marginLeft: `-${value}`,
              "& > *": {
                marginTop: value,
                marginLeft: value,
              },
            },
            [`.flex-gap-x-${e(key)}`]: {
              marginLeft: `-${value}`,
              "& > *": {
                marginLeft: value,
              },
            },
            [`.flex-gap-y-${e(key)}`]: {
              marginTop: `-${value}`,
              "& > *": {
                marginTop: value,
              },
            },
          },
          variants("gap")
        )
      );
    }),
  ],
};
