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
    // Surfaces, from furthest back to closest to the user. Each step must be
    // visibly different from the one before it, or cards vanish into the page.
    background: '#F4F4F7',
    surface: '#FFFFFF',
    'surface-subtle': '#EFEFF2',
    field: '#F7F7FA',

    // Text and icons.
    content: '#101114',
    'content-secondary': '#60646C',
    'content-tertiary': '#8C919B',
    'content-inverse': '#FFFFFF',

    // Primary actions: Next, Save, the active tab. Near-black rather than a
    // brand colour, so the accent below stays reserved for one job.
    action: '#22262B',
    'action-hover': '#0F1215',
    'on-action': '#FFFFFF',

    // Accent, used only for adding places and suggestions, so the teal always
    // means "this adds something to your route".
    accent: '#12C0D3',
    'accent-hover': '#0FA9BA',
    'accent-subtle': '#E4F8FB',
    'on-accent': '#FFFFFF',

    // Routes drawn on a map: the selected leg, and the alternates behind it.
    route: '#6A4CE4',
    'route-muted': '#9AA0A6',

    // The flat world maps on trip cards. Not the interactive map, which is
    // rendered by the OS and cannot be themed.
    'map-water': '#BEDDEA',
    'map-land': '#FFFFFF',
    'map-visited': '#D9DE8E',
    'map-outline': '#CFE6F0',

    // Status.
    success: '#16915A',
    warning: '#BF8008',
    danger: '#D03038',

    // Lines, dividers, and the scrim behind a modal sheet.
    border: '#E4E5EA',
    'border-strong': '#C6C8D2',
    overlay: '#000000',
  },

  dark: {
    background: '#09090B',
    surface: '#17181C',
    'surface-subtle': '#22242B',
    field: '#1C1D22',

    content: '#FAFAFC',
    'content-secondary': '#B0B4BA',
    'content-tertiary': '#82868E',
    'content-inverse': '#101114',

    // A primary button has to stay the highest-contrast thing on screen, so on
    // a dark background it inverts to light rather than getting darker.
    action: '#F4F4F7',
    'action-hover': '#FFFFFF',
    'on-action': '#101114',

    accent: '#2ED3E4',
    'accent-hover': '#5CDDEB',
    'accent-subtle': '#0E2E33',
    'on-accent': '#04262B',

    route: '#8E7BFF',
    'route-muted': '#6B7076',

    'map-water': '#16323D',
    'map-land': '#1D2024',
    'map-visited': '#8E9648',
    'map-outline': '#22414D',

    success: '#3DB87A',
    warning: '#E2A82C',
    danger: '#F0646A',

    border: '#2E3135',
    'border-strong': '#464A50',
    overlay: '#000000',
  },
};

/** Corner radii, in points. */
const radius = {
  card: 16,
  control: 12,
  field: 14,
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
