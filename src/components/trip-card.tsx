import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Trip, TripStatus } from '@/data/trips';
import { useThemeColors } from '@/theme';

const statusTone: Record<TripStatus, BadgeTone> = {
  planned: 'neutral',
  active: 'brand',
  complete: 'success',
};

export function TripCard({ trip }: { trip: Trip }) {
  const colors = useThemeColors();

  return (
    <Link href={{ pathname: '/trip/[id]', params: { id: trip.id } }} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${trip.title}`}>
        <Card className="gap-3 active:opacity-70">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text variant="headline">{trip.title}</Text>
              <Text variant="footnote">{trip.location}</Text>
            </View>
            <Badge label={trip.status} tone={statusTone[trip.status]} />
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="calendar-outline" size={14} color={colors['content-tertiary']} />
              <Text variant="footnote">{trip.startsOn}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="navigate-outline" size={14} color={colors['content-tertiary']} />
              <Text variant="footnote">{trip.distanceKm} km</Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
