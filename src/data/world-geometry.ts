import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import topology from 'world-atlas/countries-110m.json';

/**
 * Country outlines for the flat maps on trip cards.
 *
 * The source is Natural Earth data shipped by the `world-atlas` package, stored
 * as TopoJSON — a format that describes shared borders once instead of twice,
 * which is why the whole world fits in about 100KB. It has to be expanded into
 * ordinary GeoJSON before it can be drawn, so that happens once here at module
 * load rather than per card.
 *
 * 110m is the coarsest of the three resolutions available. At thumbnail size
 * the finer ones are indistinguishable and cost megabytes.
 */

export type CountryGeometry = Feature<Polygon | MultiPolygon, { name: string }>;

const topojson = topology as unknown as Topology;

const collection = feature(topojson, topojson.objects.countries) as unknown as FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
>;

/** Every country, in no particular order. */
export const countryGeometries: CountryGeometry[] = collection.features;

const byCode = new Map<string, CountryGeometry>(
  countryGeometries.map((country) => [String(country.id), country])
);

const byName = new Map<string, CountryGeometry>(
  countryGeometries.map((country) => [country.properties.name.toLowerCase(), country])
);

/**
 * Looks up countries by ISO 3166-1 numeric code, falling back to name.
 *
 * Codes are preferred because names drift between datasets — "United States of
 * America" here is "United States" in plenty of other sources, and a silent
 * miss would just mean a country quietly failing to highlight.
 *
 * Unknown entries are skipped rather than throwing: a map missing one country
 * is a better outcome than a screen that will not render.
 */
export function findCountries(identifiers: string[]): CountryGeometry[] {
  const found: CountryGeometry[] = [];

  for (const identifier of identifiers) {
    const match = byCode.get(identifier) ?? byName.get(identifier.toLowerCase());
    if (match) found.push(match);
  }

  return found;
}
