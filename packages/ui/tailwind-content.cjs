const path = require("node:path");

/** Glob for consuming apps to include shared UI classes in Tailwind content. */
module.exports = path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}");
