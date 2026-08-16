/**
 * Placeholder data so the app has something to render before a backend exists.
 *
 * Keeping fake data behind the same function shape you will eventually use for
 * real requests means swapping in a database later only changes this file —
 * every screen that calls `getTrips()` keeps working untouched.
 * See docs/08-add-a-backend.md.
 */

export type TripStatus = 'planned' | 'active' | 'complete';

export type Trip = {
  id: string;
  title: string;
  location: string;
  startsOn: string;
  distanceKm: number;
  status: TripStatus;
  notes: string;
};

const TRIPS: Trip[] = [
  {
    id: 'coast-road',
    title: 'Coast Road',
    location: 'Big Sur, California',
    startsOn: '12 Sep',
    distanceKm: 148,
    status: 'active',
    notes: 'Cliffside route with three planned stops. Fog clears after midday.',
  },
  {
    id: 'alpine-loop',
    title: 'Alpine Loop',
    location: 'Dolomites, Italy',
    startsOn: '04 Oct',
    distanceKm: 92,
    status: 'planned',
    notes: 'Steep first climb, then a long descent into the valley.',
  },
  {
    id: 'desert-run',
    title: 'Desert Run',
    location: 'Moab, Utah',
    startsOn: '21 Jun',
    distanceKm: 210,
    status: 'complete',
    notes: 'Start before sunrise. Water resupply is only available at the halfway point.',
  },
];

export function getTrips(): Trip[] {
  return TRIPS;
}

export function getTrip(id: string): Trip | undefined {
  return TRIPS.find((trip) => trip.id === id);
}
