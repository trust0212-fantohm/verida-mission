/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Sora", "sans-serif"],
    },
    extend: {
      colors: {
        white: "hsl(var(--white))",
        black: "hsl(var(--black))",
        translucent: "rgba(17, 17, 17, 0.2)",
        transparent: {
          DEFAULT: "hsla(var(--white) / 0)",
          5: "hsla(var(--white) / 0.05)",
          10: "hsla(var(--white) / 0.10)",
          15: "hsla(var(--white) / 0.15)",
          30: "hsla(var(--white) / 0.3)",
        },

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsla(var(--background) / 0.2)",
          foreground: "hsla(var(--foreground) / 0.7)",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          background: "hsla(var(--primary) / 0.2)",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          background: "hsla(var(--success) / 0.2)",
        },
        pending: {
          DEFAULT: "hsl(var(--pending))",
          background: "hsla(var(--pending) / 0.2)",
        },
        gray: {
          DEFAULT: "hsl(var(--gray))",
        },

        button: {
          DEFAULT: "hsla(var(--white) / 0.15)",
          hover: "hsla(var(--white) / 0.3)",
        },
        border: "hsla(var(--white) / 0.15)",
        divider: {
          DEFAULT: "hsla(var(--white) / 0.15)",
        },
      },
      fontSize: {
        "heading-l": [
          "3rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-m": [
          "1.75rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-s": [
          "1.25rem",
          {
            lineHeight: "120%",
            fontWeight: "600",
          },
        ],
        "base": [
          "1rem",
          {
            lineHeight: "140%",
            fontWeight: "400",
          },
        ],
        "subtitle": [
          "0.875rem",
          {
            lineHeight: "1rem",
            fontWeight: "600",
          },
        ],
        "button": [
          "0.875rem",
          {
            lineHeight: "1rem",
            fontWeight: "600",
          },
        ],
      },
      animation: {
        "spin-slow": "spin 5s linear infinite",
      },
      screens: {
        sm: "696px",
      },
      spacing: {
        4.5: "1.125rem",
      },
      backdropBlur: {
        xs: "3px",
      },
      lineHeight: {
        3.5: "0.875rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
