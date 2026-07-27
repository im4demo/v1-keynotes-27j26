/** @type {import("tailwindcss").Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1c241f",
          muted: "#5e6b63",
          faint: "#8a958e",
        },
        paper: {
          DEFAULT: "#f3f5f1",
          elevated: "#ffffff",
          line: "#d5ddd6",
        },
        accent: {
          DEFAULT: "#0f6b5c",
          hover: "#0c5649",
          soft: "#e4f2ee",
        },
        danger: {
          DEFAULT: "#9b2c2c",
          hover: "#7f2323",
          soft: "#fce8e8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(28 36 31 / 0.06), 0 8px 24px rgb(28 36 31 / 0.06)",
      },
    },
  },
  plugins: [],
};
