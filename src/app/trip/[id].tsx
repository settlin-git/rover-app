import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { getTrip } from '@/data/trips';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTrip(id);

  if (!trip) {
    return (
      <Screen>
        <Text variant="title">Trip not found</Text>
        <Text variant="footnote">No saved trip matches “{id}”.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: trip.title }} />

      <View className="gap-2">
        <Badge label={trip.status} tone={trip.status === 'complete' ? 'success' : 'brand'} />
        <Text variant="display">{trip.title}</Text>
        <Text variant="footnote">{trip.location}</Text>
      </View>

      <Card className="flex-row justify-between">
        <View className="gap-1">
          <Text variant="caption">Starts</Text>
          <Text variant="headline">{trip.startsOn}</Text>
        </View>
        <View className="gap-1">
          <Text variant="caption">Distance</Text>
          <Text variant="headline">{trip.distanceKm} km</Text>
        </View>
      </Card>

      <Card variant="outlined">
        <Text variant="caption">Notes</Text>
        <Text variant="body">{trip.notes}</Text>
      </Card>

      <Button label="Start navigation" />
    </Screen>
  );
}
