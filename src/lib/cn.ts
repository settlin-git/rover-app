import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { colors, fontSize, radius } from '@/theme/tokens';

/**
 * `cn()` joins class names and resolves conflicts, so a component's own styling
 * can always be overridden by the `className` a caller passes in.
 *
 * The extension below is not optional. tailwind-merge only knows the class
 * names Tailwind ships with, and it has to guess at custom ones. Left to guess,
 * it reads `text-display` as a colour, decides it clashes with `text-content`,
 * and silently drops the font size — text renders at the default size with no
 * error to explain why. Listing our token names tells it which `text-*` classes
 * are sizes and which are colours.
 *
 * Because the lists come from tokens.js, a new token is handled automatically.
 */
const colorNames = Object.keys(colors.light);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: Object.keys(fontSize) }],
      'text-color': [{ text: colorNames }],
      'bg-color': [{ bg: colorNames }],
      'border-color': [{ border: colorNames }],
      rounded: [{ rounded: Object.keys(radius) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
