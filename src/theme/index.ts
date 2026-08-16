import { useColorScheme } from 'react-native';

import { colors, fontSize, radius } from './tokens';

export { colors, fontSize, radius };

/**
 * Returns the raw colour values for the active colour scheme.
 *
 * Prefer Tailwind classes (`bg-surface`, `text-content`) in your own
 * components — they already react to light and dark mode. Reach for this hook
 * only where an API demands a colour string, such as navigation bar options,
 * `<StatusBar>`, or chart libraries.
 */
export function useThemeColors() {
  return useColorScheme() === 'dark' ? colors.dark : colors.light;
}
