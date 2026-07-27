const uiContent = require("@keynotes/ui/tailwind-content");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", uiContent],
  presets: [require("@keynotes/config/tailwind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
