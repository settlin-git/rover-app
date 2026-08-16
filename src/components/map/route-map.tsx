import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';

import type { RouteMapProps } from '@/components/map/types';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/theme';

/** Somewhere recognisable to open on before the route has any places. */
const INITIAL_REGION: Region = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

/**
 * The interactive map in the route builder.
 *
 * Uses the map built into the operating system — Apple Maps on iOS, Google Maps
 * on Android. On iOS that works in Expo Go with no API key. Android needs a
 * Google Maps key and a development build; see docs/12-maps.md.
 */
export function RouteMap({ places, previewPlaces, className }: RouteMapProps) {
  const colors = useThemeColors();
  const mapRef = useRef<MapView>(null);

  const coordinates = places.map((place) => ({
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  const previewCoordinates = (previewPlaces ?? []).map((place) => ({
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  // Keep every stop in view as the route changes. The bottom half of the screen
  // is usually covered by the sheet, so the padding is deliberately lopsided.
  const fingerprint = places.map((place) => place.id).join(',');

  useEffect(() => {
    if (coordinates.length === 0) return;

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 90, right: 70, bottom: 260, left: 70 },
      animated: true,
    });
    // Refit only when the set of stops changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingerprint]);

  return (
    <View className={cn('flex-1', className)}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        showsPointsOfInterests={false}
        toolbarEnabled={false}>
        {previewCoordinates.length > 1 ? (
          <Polyline
            coordinates={previewCoordinates}
            strokeColor={colors['route-muted']}
            strokeWidth={3}
          />
        ) : null}

        {coordinates.length > 1 ? (
          <Polyline coordinates={coordinates} strokeColor={colors.route} strokeWidth={4} />
        ) : null}

        {places.map((place, index) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.region}
            tracksViewChanges={false}>
            <View
              className="h-7 w-7 items-center justify-center rounded-pill border-2 border-white bg-route"
              // The marker's own view is what gets dropped on the map, so the
              // shadow has to be on it rather than on a wrapper.
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 4,
              }}>
              <Text variant="caption" className="font-bold text-white">
                {index + 1}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
