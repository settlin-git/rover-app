import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { WorldMap } from '@/components/map/world-map';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { type Trip, tripDuration } from '@/data/trips';
import { useThemeColors } from '@/theme';

const MAP_HEIGHT = 180;

function CountRow({ trip }: { trip: Trip }) {
  const counts = [
    { value: trip.countries.length, label: trip.countries.length === 1 ? 'Country' : 'Countries' },
    { value: trip.provinceCount, label: trip.provinceCount === 1 ? 'Province' : 'Provinces' },
    { value: trip.cityCount, label: trip.cityCount === 1 ? 'City' : 'Cities' },
  ];

  return (
    <View className="flex-row items-center">
      {counts.map((count, index) => (
        <View key={count.label} className="flex-row items-center">
          {index > 0 ? <Divider orientation="vertical" className="mx-3 h-4" /> : null}
          <View className="flex-row items-baseline gap-1">
            <Text variant="footnote" className="font-semibold text-content">
              {count.value}
            </Text>
            <Text variant="footnote">{count.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  const colors = useThemeColors();
  // The map needs pixel dimensions to project onto, and the card is sized by
  // its parent, so the width has to be measured rather than assumed.
  const [width, setWidth] = useState(0);

  return (
    <Link href={{ pathname: '/trip/[id]', params: { id: trip.id } }} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${trip.name}`}>
        <View
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          className="overflow-hidden rounded-card bg-surface active:opacity-90">
          {width > 0 ? (
            <WorldMap visited={trip.countries} width={width} height={MAP_HEIGHT} />
          ) : (
            <View style={{ height: MAP_HEIGHT }} className="bg-map-water" />
          )}

          <View className="gap-3 p-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text variant="headline" className="flex-1" numberOfLines={1}>
                {trip.name}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="calendar-outline" size={15} color={colors['content-secondary']} />
                <Text variant="footnote">{tripDuration(trip)} days</Text>
              </View>
            </View>

            <CountRow trip={trip} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
