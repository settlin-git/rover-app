import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins class names together and lets later classes win over earlier ones, so
 * a component's own styling can always be overridden by the `className` a
 * caller passes in.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
