/**
 * The catalogue of places a route can be built from.
 *
 * This stands in for a geocoding service. Every function here is async and
 * returns the shape a real API would, so swapping in Google Places, Mapbox or a
 * Supabase table later changes this file and nothing else.
 */

export type Place = {
  id: string;
  /** What the user recognises: "New Delhi". */
  name: string;
  /** Disambiguating context: "Delhi, India". */
  region: string;
  latitude: number;
  longitude: number;
  /** ISO 3166-1 numeric code, so a trip's map knows what to highlight. */
  countryCode: string;
};

const CATALOGUE: Place[] = [
  {
    id: 'new-delhi',
    name: 'New Delhi',
    region: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    countryCode: '356',
  },
  {
    id: 'agra',
    name: 'Agra',
    region: 'Uttar Pradesh, India',
    latitude: 27.1767,
    longitude: 78.0081,
    countryCode: '356',
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala',
    region: 'Himachal Pradesh, India',
    latitude: 32.219,
    longitude: 76.3234,
    countryCode: '356',
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    region: 'Uttarakhand, India',
    latitude: 30.0869,
    longitude: 78.2676,
    countryCode: '356',
  },
  {
    id: 'manali',
    name: 'Manali',
    region: 'Himachal Pradesh, India',
    latitude: 32.2432,
    longitude: 77.1892,
    countryCode: '356',
  },
  {
    id: 'shimla',
    name: 'Shimla',
    region: 'Himachal Pradesh, India',
    latitude: 31.1048,
    longitude: 77.1734,
    countryCode: '356',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan, India',
    latitude: 26.9124,
    longitude: 75.7873,
    countryCode: '356',
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    region: 'Punjab, India',
    latitude: 31.634,
    longitude: 74.8723,
    countryCode: '356',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh, India',
    latitude: 25.3176,
    longitude: 82.9739,
    countryCode: '356',
  },
  {
    id: 'new-york',
    name: 'New York',
    region: 'NY, USA',
    latitude: 40.7128,
    longitude: -74.006,
    countryCode: '840',
  },
  {
    id: 'new-england',
    name: 'New England',
    region: 'ND, USA',
    latitude: 46.5333,
    longitude: -102.8672,
    countryCode: '840',
  },
  {
    id: 'newcastle',
    name: 'Newcastle',
    region: 'England, United Kingdom',
    latitude: 54.9783,
    longitude: -1.6178,
    countryCode: '826',
  },
];

/**
 * Places worth adding near a route, keyed by the place they sit between.
 *
 * A real implementation would ask a recommendation service. Keeping the same
 * async signature means the screen does not change when it does.
 */
const SUGGESTIONS: Record<string, string[]> = {
  agra: ['rishikesh'],
  rishikesh: ['manali'],
  'new-delhi': ['jaipur'],
  manali: ['shimla'],
  dharamshala: ['amritsar'],
};

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Free-text place search. Matches on name first, then region. */
export async function searchPlaces(query: string): Promise<Place[]> {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length === 0) return delay([], 0);

  const matches = CATALOGUE.filter(
    (place) =>
      place.name.toLowerCase().startsWith(trimmed) ||
      place.name.toLowerCase().includes(trimmed) ||
      place.region.toLowerCase().includes(trimmed)
  );

  // Names beginning with the query are what the user almost always meant.
  matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(trimmed) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(trimmed) ? 0 : 1;
    return aStarts - bStarts || a.name.localeCompare(b.name);
  });

  return delay(matches);
}

/**
 * Places to consider adding to a route, in the order they should be inserted.
 *
 * Each suggestion carries the id of the place it should follow, so the list can
 * show it in the position it would actually occupy rather than in a separate
 * panel the user has to mentally merge.
 */
export type Suggestion = { place: Place; afterPlaceId: string };

export async function suggestPlaces(routePlaceIds: string[]): Promise<Suggestion[]> {
  const onRoute = new Set(routePlaceIds);
  const suggestions: Suggestion[] = [];

  for (const placeId of routePlaceIds) {
    for (const candidateId of SUGGESTIONS[placeId] ?? []) {
      if (onRoute.has(candidateId) || suggestions.some((s) => s.place.id === candidateId)) continue;

      const place = CATALOGUE.find((p) => p.id === candidateId);
      if (place) suggestions.push({ place, afterPlaceId: placeId });
    }
  }

  return delay(suggestions, 400);
}

export function getPlace(id: string): Place | undefined {
  return CATALOGUE.find((place) => place.id === id);
}
