/**
 * DESIGN TOKENS — the single source of truth for the app's visual language.
 *
 * This file is the code twin of your Figma Variables. When a value changes in
 * Figma, change it here and nowhere else, then run:
 *
 *     npm run tokens
 *
 * That regenerates src/global.css. tailwind.config.js reads this file directly,
 * so a token added here immediately becomes a utility class you can use, and
 * `useThemeColors()` exposes the same values to the few React Native APIs that
 * need a raw colour string instead of a class name.
 *
 * Naming rule: use the role a colour plays ("danger"), never the colour it
 * happens to be ("red"). Roles survive a rebrand; colour names do not.
 */

/** Light and dark must always declare exactly the same set of keys. */
const colors = {
  light: {
    // Surfaces, from furthest back to closest to the user.
    background: '#FFFFFF',
    surface: '#FAFAFC',
    'surface-raised': '#FFFFFF',
    'surface-sunken': '#F1F1F5',

    // Text and icons.
    content: '#101114',
    'content-secondary': '#60646C',
    'content-tertiary': '#8C919B',
    'content-inverse': '#FFFFFF',

    // Brand.
    brand: '#4F46E5',
    'brand-hover': '#4338CA',
    'brand-subtle': '#EEEEFF',
    'on-brand': '#FFFFFF',

    // Status.
    success: '#16915A',
    warning: '#BF8008',
    danger: '#D03038',

    // Lines and dividers.
    border: '#E2E3E9',
    'border-strong': '#C6C8D2',
  },

  dark: {
    background: '#09090B',
    surface: '#16171A',
    'surface-raised': '#212226',
    'surface-sunken': '#000000',

    content: '#FAFAFC',
    'content-secondary': '#B0B4BA',
    'content-tertiary': '#82868E',
    'content-inverse': '#101114',

    brand: '#817AFF',
    'brand-hover': '#958FFF',
    'brand-subtle': '#1F1E38',
    'on-brand': '#0C0C14',

    success: '#3DB87A',
    warning: '#E2A82C',
    danger: '#F0646A',

    border: '#2E3135',
    'border-strong': '#464A50',
  },
};

/** Corner radii, in points. */
const radius = {
  card: 16,
  control: 12,
  pill: 999,
};

/** Type scale as [fontSize, lineHeight] pairs, in points. */
const fontSize = {
  caption: [12, 16],
  footnote: [14, 20],
  body: [16, 24],
  headline: [20, 28],
  title: [28, 34],
  display: [34, 40],
};

module.exports = { colors, radius, fontSize };
