import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { countryGeometries, findCountries, type CountryGeometry } from '@/data/world-geometry';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/theme';

export type WorldMapProps = {
  /**
   * Countries to highlight, as ISO 3166-1 numeric codes (or names as a
   * fallback). The map frames itself around these.
   */
  visited: string[];
  width: number;
  height: number;
  /**
   * How much surrounding context to show. 1 fits the visited countries edge to
   * edge; higher values pull the camera back. The default leaves enough
   * coastline around a country to make it recognisable.
   */
  context?: number;
  className?: string;
};

function collect(features: CountryGeometry[]): FeatureCollection<Polygon | MultiPolygon> {
  return { type: 'FeatureCollection', features };
}

/**
 * A flat, stylised map of the world with a trip's countries picked out.
 *
 * This is deliberately not the interactive map. It renders as two SVG paths —
 * one for all land, one for the visited countries — which keeps a scrolling
 * list of trip cards cheap. An embedded map view per card would not be.
 */
export function WorldMap({ visited, width, height, context = 2.6, className }: WorldMapProps) {
  const colors = useThemeColors();

  const { landPath, visitedPath } = useMemo(() => {
    const highlighted = findCountries(visited);

    // Frame the map by fitting the visited countries into a box larger than the
    // viewport. Fitting them to the viewport exactly would crop away the
    // surrounding coastline that makes a shape recognisable.
    const padX = (width * (context - 1)) / 2;
    const padY = (height * (context - 1)) / 2;

    const focus = highlighted.length > 0 ? collect(highlighted) : collect(countryGeometries);
    const extent: [[number, number], [number, number]] =
      highlighted.length > 0
        ? [
            [-padX, -padY],
            [width + padX, height + padY],
          ]
        : [
            [0, 0],
            [width, height],
          ];

    const projection = geoMercator().fitExtent(extent, focus);
    const toPath = geoPath(projection);

    return {
      landPath: toPath(collect(countryGeometries)) ?? '',
      visitedPath: highlighted.length > 0 ? (toPath(collect(highlighted)) ?? '') : '',
    };
  }, [visited, width, height, context]);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        visited.length > 0 ? `Map highlighting ${visited.length} visited countries` : 'World map'
      }
      className={cn('overflow-hidden', className)}
      style={{ width, height }}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={colors['map-water']} />
        <Path
          d={landPath}
          fill={colors['map-land']}
          stroke={colors['map-outline']}
          strokeWidth={0.5}
        />
        {visitedPath ? (
          <Path
            d={visitedPath}
            fill={colors['map-visited']}
            stroke={colors['map-outline']}
            strokeWidth={0.5}
          />
        ) : null}
      </Svg>
    </View>
  );
}
