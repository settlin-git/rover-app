import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Polyline as SvgPolyline, Rect, Text as SvgText } from 'react-native-svg';

import type { RouteMapProps } from '@/components/map/types';
import { countryGeometries } from '@/data/world-geometry';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/theme';

const land: FeatureCollection<Polygon | MultiPolygon> = {
  type: 'FeatureCollection',
  features: countryGeometries,
};

/**
 * Browser stand-in for the interactive map.
 *
 * react-native-maps has no web build, so `npm run web` would crash on the route
 * builder without this. It draws the same route over real country outlines,
 * which is enough to check layout and the sheet in a browser — but it does not
 * pan, zoom or show streets. Judge the map itself on a phone.
 */
export function RouteMap({ places, previewPlaces, className }: RouteMapProps) {
  const colors = useThemeColors();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const geometry = useMemo(() => {
    if (size.width === 0 || size.height === 0) return null;

    const points = places.map((place) => [place.longitude, place.latitude] as [number, number]);

    const projection = geoMercator();

    if (points.length > 0) {
      projection.fitExtent(
        [
          [48, 48],
          [size.width - 48, size.height - 220],
        ],
        {
          type: 'FeatureCollection',
          features: points.map((coordinates) => ({
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'Point' as const, coordinates },
          })),
        }
      );

      // A single stop gives fitExtent no extent to work with, so it produces an
      // absurd zoom. Pick a sensible city-scale scale instead.
      if (points.length === 1) {
        projection.scale(3000).translate([size.width / 2, (size.height - 180) / 2]);
        projection.center(points[0]);
      }
    } else {
      projection.fitExtent(
        [
          [0, 0],
          [size.width, size.height],
        ],
        land
      );
    }

    const project = (place: { longitude: number; latitude: number }) =>
      projection([place.longitude, place.latitude]) ?? [0, 0];

    const toPoints = (list: typeof places) =>
      list
        .map((place) => project(place))
        .map(([x, y]) => `${x},${y}`)
        .join(' ');

    return {
      landPath: geoPath(projection)(land) ?? '',
      routePoints: toPoints(places),
      previewPoints: previewPlaces ? toPoints(previewPlaces) : '',
      pins: places.map((place) => ({ place, position: project(place) })),
    };
  }, [places, previewPlaces, size]);

  return (
    <View
      className={cn('flex-1 overflow-hidden', className)}
      onLayout={(event) =>
        setSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }>
      {geometry ? (
        <Svg width={size.width} height={size.height}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill={colors['map-water']}
          />
          <Path
            d={geometry.landPath}
            fill={colors['map-land']}
            stroke={colors['map-outline']}
            strokeWidth={0.6}
          />

          {geometry.previewPoints ? (
            <SvgPolyline
              points={geometry.previewPoints}
              fill="none"
              stroke={colors['route-muted']}
              strokeWidth={3}
            />
          ) : null}

          {places.length > 1 ? (
            <SvgPolyline
              points={geometry.routePoints}
              fill="none"
              stroke={colors.route}
              strokeWidth={4}
            />
          ) : null}

          {geometry.pins.map(({ place, position }, index) => (
            <Circle
              key={place.id}
              cx={position[0]}
              cy={position[1]}
              r={13}
              fill={colors.route}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          ))}

          {geometry.pins.map(({ place, position }, index) => (
            <SvgText
              key={`${place.id}-label`}
              x={position[0]}
              y={position[1] + 4}
              fontSize={11}
              fontWeight="bold"
              fill="#FFFFFF"
              textAnchor="middle">
              {index + 1}
            </SvgText>
          ))}
        </Svg>
      ) : null}
    </View>
  );
}
