import { Platform, useColorScheme } from 'react-native';

import { colors, fontSize, radius } from './tokens';

export { colors, fontSize, radius };

/**
 * Returns the raw colour values for the active colour scheme.
 *
 * Prefer Tailwind classes (`bg-surface`, `text-content`) in your own
 * components — they already react to light and dark mode. Reach for this hook
 * only where an API demands a colour string, such as navigation bar options,
 * `<StatusBar>`, SVG fills, or the interactive map.
 */
export function useThemeColors() {
  return useColorScheme() === 'dark' ? colors.dark : colors.light;
}

/**
 * Drop shadows, which are the one visual property with no Tailwind class here.
 * iOS and Android express shadows through completely different props, so these
 * are plain style objects to be passed to `style`.
 *
 * Android's `elevation` also draws its own background, so a shadowed view there
 * must have a solid `backgroundColor` or the shadow will look like a grey box.
 */
export const shadow = {
  /** Cards resting on the page. */
  card: Platform.select({
    ios: {
      shadowColor: '#101114',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  /** Controls floating above a map, which need to separate from busy imagery. */
  floating: Platform.select({
    ios: {
      shadowColor: '#101114',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }),
  /** A sheet sliding up over content. */
  sheet: Platform.select({
    ios: {
      shadowColor: '#101114',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 16 },
    default: {},
  }),
} as const;
