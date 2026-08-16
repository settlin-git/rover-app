import { durationInDays } from '@/lib/dates';

/**
 * Trips, held in memory.
 *
 * Keeping fake data behind the same function shape you will eventually use for
 * real requests means swapping in a database later only changes this file —
 * every screen that calls `getTrips()` keeps working untouched.
 * See docs/09-backend.md.
 */

export type Trip = {
  id: string;
  name: string;
  /** `YYYY-MM-DD`. */
  startsOn: string;
  endsOn: string;
  completed: boolean;
  /**
   * ISO 3166-1 numeric codes for every country the route passes through. This
   * is what the card's map highlights, so it has to be codes rather than
   * display names.
   */
  countries: string[];
  provinceCount: number;
  cityCount: number;
  /** Place ids from the catalogue in `places.ts`, in travel order. */
  placeIds: string[];
};

const TRIPS: Trip[] = [
  {
    id: 'china-2016',
    name: 'China trip 2016',
    startsOn: '2016-04-08',
    endsOn: '2016-06-02',
    completed: true,
    countries: ['156'],
    provinceCount: 6,
    cityCount: 21,
    placeIds: [],
  },
  {
    id: 'south-america-2015',
    name: 'South America trip 2015',
    startsOn: '2015-09-14',
    endsOn: '2015-11-15',
    completed: true,
    countries: ['604', '068', '152', '032'],
    provinceCount: 18,
    cityCount: 32,
    placeIds: [],
  },
  {
    id: 'north-india-2024',
    name: 'North India loop',
    startsOn: '2024-10-02',
    endsOn: '2024-10-19',
    completed: true,
    countries: ['356'],
    provinceCount: 4,
    cityCount: 9,
    placeIds: ['new-delhi', 'agra', 'rishikesh', 'dharamshala'],
  },
];

export function getTrips(): Trip[] {
  return TRIPS;
}

export function getTrip(id: string): Trip | undefined {
  return TRIPS.find((trip) => trip.id === id);
}

export function tripDuration(trip: Trip): number {
  return durationInDays(trip.startsOn, trip.endsOn);
}

export type NewTrip = Omit<Trip, 'id' | 'provinceCount' | 'cityCount' | 'countries'> & {
  countries: string[];
};

/**
 * Saves a newly built route as a trip.
 *
 * Province counts are not derived here because working out which administrative
 * region a coordinate falls in needs a real geocoder. Until there is one, the
 * count stays at zero rather than being guessed at.
 */
export function createTrip(input: NewTrip): Trip {
  const trip: Trip = {
    ...input,
    id: `trip-${Date.now()}`,
    provinceCount: 0,
    cityCount: input.placeIds.length,
  };

  TRIPS.unshift(trip);
  return trip;
}
