import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { type Place, type Suggestion, suggestPlaces } from '@/data/places';

type RouteContextValue = {
  /** The route itself, in travel order. */
  places: Place[];
  /** Places offered for insertion, each remembering where it belongs. */
  suggestions: Suggestion[];
  suggestionsVisible: boolean;
  suggestionsLoading: boolean;

  addPlace: (place: Place) => void;
  removePlace: (placeId: string) => void;
  setPlaces: (places: Place[]) => void;
  toggleSuggestions: () => void;
  hideSuggestions: () => void;
  acceptSuggestion: (suggestion: Suggestion) => void;
  reset: () => void;
};

const RouteContext = createContext<RouteContextValue | null>(null);

/**
 * Holds the route being built.
 *
 * This lives in a provider rather than in the screen because the builder spans
 * several screens — the map, the place search and the details sheet all read
 * and write the same list. It is mounted by the route modal's layout, so the
 * state exists exactly as long as the modal does and a cancelled route leaves
 * nothing behind.
 */
export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlacesState] = useState<Place[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const addPlace = useCallback((place: Place) => {
    setPlacesState((current) =>
      // Adding a place twice is almost always a mis-tap rather than an
      // intentional there-and-back, so it is ignored.
      current.some((existing) => existing.id === place.id) ? current : [...current, place]
    );
  }, []);

  const removePlace = useCallback((placeId: string) => {
    setPlacesState((current) => current.filter((place) => place.id !== placeId));
    setSuggestions((current) => current.filter((s) => s.afterPlaceId !== placeId));
  }, []);

  const setPlaces = useCallback((next: Place[]) => {
    setPlacesState(next);
  }, []);

  const hideSuggestions = useCallback(() => {
    setSuggestionsVisible(false);
    setSuggestions([]);
  }, []);

  const toggleSuggestions = useCallback(() => {
    if (suggestionsVisible) {
      hideSuggestions();
      return;
    }
    // Set here rather than in the effect below: a spinner belongs to the tap
    // that asked for suggestions, not to every later refresh of them.
    setSuggestionsLoading(true);
    setSuggestionsVisible(true);
  }, [suggestionsVisible, hideSuggestions]);

  const acceptSuggestion = useCallback((suggestion: Suggestion) => {
    setPlacesState((current) => {
      const index = current.findIndex((place) => place.id === suggestion.afterPlaceId);
      if (index === -1) return [...current, suggestion.place];

      const next = [...current];
      next.splice(index + 1, 0, suggestion.place);
      return next;
    });
    setSuggestions((current) => current.filter((s) => s.place.id !== suggestion.place.id));
  }, []);

  const reset = useCallback(() => {
    setPlacesState([]);
    setSuggestions([]);
    setSuggestionsVisible(false);
  }, []);

  // Fetching runs as an effect rather than inside the toggle so that editing the
  // route while suggestions are open refreshes them against the new list.
  const placeIds = places.map((place) => place.id).join(',');

  useEffect(() => {
    if (!suggestionsVisible) return;

    let cancelled = false;

    suggestPlaces(placeIds.length > 0 ? placeIds.split(',') : [])
      .then((result) => {
        if (!cancelled) setSuggestions(result);
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [suggestionsVisible, placeIds]);

  const value = useMemo<RouteContextValue>(
    () => ({
      places,
      suggestions,
      suggestionsVisible,
      suggestionsLoading,
      addPlace,
      removePlace,
      setPlaces,
      toggleSuggestions,
      hideSuggestions,
      acceptSuggestion,
      reset,
    }),
    [
      places,
      suggestions,
      suggestionsVisible,
      suggestionsLoading,
      addPlace,
      removePlace,
      setPlaces,
      toggleSuggestions,
      hideSuggestions,
      acceptSuggestion,
      reset,
    ]
  );

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useRoute must be used inside a RouteProvider');
  return context;
}
