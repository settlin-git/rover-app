import type { Place } from '@/data/places';

/**
 * Shared contract for the two `RouteMap` implementations.
 *
 * `route-map.tsx` renders the real OS map on a phone. `route-map.web.tsx`
 * renders a flat projection in the browser, because react-native-maps has no
 * web build. Metro picks the right file per platform; keeping the props in one
 * place is what stops the two drifting apart.
 */
export type RouteMapProps = {
  /** The route, in travel order. Drawn as a solid line through numbered pins. */
  places: Place[];
  /**
   * The route as it would look with the current suggestions accepted. Drawn
   * behind the real one in a muted colour, so the effect of accepting them is
   * visible before committing.
   */
  previewPlaces?: Place[];
  className?: string;
};
