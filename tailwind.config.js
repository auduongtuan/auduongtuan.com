const plugin = require("tailwindcss/plugin");

module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: "selector",
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
      boxShadow: {
        "button-inner": "0px 2px 0px 0px rgba(255, 255, 255, 0.25) inset",
      },
      fontFamily: {
        // "display": ['Work Sans', ],
        display: ["Hanken Grotesk", "Helvetica", "Arial", "sans-serif"],
        sans: ["Hanken Grotesk", "Helvetica", "Arial", "sans-serif"],
        serif: ["Hanken Grotesk", "Georgia", "Cambria", "serif"],
        // "script": ['Nanum Pen Script', 'IBM Plex Sans', 'Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        // sm: ["0.9375rem", "1.25rem"],
        // base: ["1.0625rem", "1.5rem"],
        // lg: ["1.1875rem", "1.875rem"],
        // xl: ["1.3125rem", "1.875rem"],
        "3xl": ["2rem", "2.5rem"],
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
        "button-primary": "var(--bg-button-primary)",
        "button-primary-hover": "var(--bg-button-primary-hover)",
        "button-primary-pressed": "var(--bg-button-primary-pressed)",
        "button-secondary": "var(--bg-button-secondary)",
        "button-secondary-hover": "var(--bg-button-secondary-hover)",
        "button-secondary-pressed": "var(--bg-button-secondary-pressed)",
        subtle: "var(--bg-subtle)",
        surface: "var(--bg-surface)",
        "surface-raised": "var(--bg-surface-raised)",
        card: "var(--bg-card)",
      }),
      textColor: ({ theme }) => ({
        primary: "var(--fg-primary)",
        secondary: "var(--fg-secondary)",
        tertiary: "var(--fg-tertiary)",
      }),
      colors: ({ theme }) => ({
        oncolor: "var(--fg-oncolor)",
        control: "var(--control)",
        accent: "var(--accent)",
        "accent-subtle": "var(--accent-subtle)",
        "accent-subtlest": "var(--accent-subtlest)",
        divider: "var(--divider)",
        underline: "var(--underline)",
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
    plugin(function ({ addVariant }) {
      addVariant(
        "sm-only",
        "@media screen and (max-width: theme('screens.md'))"
      ); // instead of hard-coded 640px use sm breakpoint value from config. Or anything
    }),
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
