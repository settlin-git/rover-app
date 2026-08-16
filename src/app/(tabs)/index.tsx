import { View } from 'react-native';

import { TripCard } from '@/components/trip-card';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { getTrips } from '@/data/trips';

export default function TripsScreen() {
  const trips = getTrips();

  return (
    <Screen>
      <View className="gap-1">
        <Text variant="caption">Rover</Text>
        <Text variant="display">Your trips</Text>
        <Text variant="footnote">{trips.length} routes saved</Text>
      </View>

      <View className="gap-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </View>

      <Button label="Plan a new trip" onPress={() => {}} />
    </Screen>
  );
}
