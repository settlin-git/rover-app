import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { WorldMap } from '@/components/map/world-map';
import { PlaceRow } from '@/components/route/place-row';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { getPlace } from '@/data/places';
import { getTrip, tripDuration } from '@/data/trips';
import { formatDate } from '@/lib/dates';

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 gap-1">
      <Text variant="caption">{label}</Text>
      <Text variant="headline">{value}</Text>
    </View>
  );
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTrip(id);
  const [mapWidth, setMapWidth] = useState(0);

  if (!trip) {
    return (
      <Screen>
        <Text variant="title">Trip not found</Text>
        <Text variant="footnote">No saved trip matches “{id}”.</Text>
      </Screen>
    );
  }

  const stops = trip.placeIds.map(getPlace).filter((place) => place !== undefined);

  return (
    <Screen>
      <Stack.Screen options={{ title: trip.name }} />

      <View className="gap-2">
        <Badge
          label={trip.completed ? 'Completed' : 'Planned'}
          tone={trip.completed ? 'success' : 'accent'}
        />
        <Text variant="title">{trip.name}</Text>
        <Text variant="footnote">
          {formatDate(trip.startsOn)} – {formatDate(trip.endsOn)}
        </Text>
      </View>

      <View
        onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)}
        className="overflow-hidden rounded-card">
        {mapWidth > 0 ? (
          <WorldMap visited={trip.countries} width={mapWidth} height={200} />
        ) : (
          <View className="h-[200px] bg-map-water" />
        )}
      </View>

      <Card className="flex-row">
        <Figure label="Length" value={`${tripDuration(trip)} days`} />
        <Divider orientation="vertical" className="mx-3 h-10" />
        <Figure label="Countries" value={String(trip.countries.length)} />
        <Divider orientation="vertical" className="mx-3 h-10" />
        <Figure label="Cities" value={String(trip.cityCount)} />
      </Card>

      {stops.length > 0 ? (
        <Card className="gap-0 px-0 py-2">
          <Text variant="caption" className="px-4 pb-1">
            Route
          </Text>
          {stops.map((place, index) => (
            <PlaceRow key={place.id} place={place} connected={index < stops.length - 1} />
          ))}
        </Card>
      ) : (
        <Card variant="outlined" className="gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={18} color="#8C919B" />
            <Text variant="body" className="font-semibold">
              No stops recorded
            </Text>
          </View>
          <Text variant="footnote">
            This trip predates route building. New trips created from the Route tab keep their
            full itinerary.
          </Text>
        </Card>
      )}
    </Screen>
  );
}
