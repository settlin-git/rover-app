const { colors, radius, fontSize } = require('./src/theme/tokens');

/**
 * Tailwind decides which utility classes exist. Everything here is derived from
 * src/theme/tokens.js, so adding a token there is all it takes to get a new
 * class — there is no second list to keep in sync.
 *
 * Colours point at the CSS variables generated into src/global.css rather than
 * at literal hex values, which is what makes light and dark mode switch
 * automatically.
 */

const themeColors = Object.fromEntries(
  Object.keys(colors.light).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`])
);

const themeRadius = Object.fromEntries(
  Object.entries(radius).map(([name, value]) => [name, `${value}px`])
);

const themeFontSize = Object.fromEntries(
  Object.entries(fontSize).map(([name, [size, lineHeight]]) => [
    name,
    [`${size}px`, `${lineHeight}px`],
  ])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: themeColors,
      borderRadius: themeRadius,
      fontSize: themeFontSize,
    },
  },
  plugins: [],
};
