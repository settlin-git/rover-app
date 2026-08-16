import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { createTrip } from '@/data/trips';
import { useRoute } from '@/features/route/route-store';
import { addDays, today } from '@/lib/dates';

export default function TripDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { places, reset } = useRoute();

  const [name, setName] = useState('');
  const [startsOn, setStartsOn] = useState('');
  const [endsOn, setEndsOn] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      setError('Give the trip a name so you can find it later.');
      return;
    }

    if (startsOn && endsOn && endsOn < startsOn) {
      setError('The end date is before the start date.');
      return;
    }

    // Dates are optional in the form but not in the data, because a trip's card
    // shows its length. An undated trip is treated as a single day starting
    // today until the traveller says otherwise.
    const start = startsOn || today();
    const end = endsOn || addDays(start, 0);

    createTrip({
      name: trimmed,
      startsOn: start,
      endsOn: end,
      completed,
      countries: [...new Set(places.map((place) => place.countryCode))],
      placeIds: places.map((place) => place.id),
    });

    reset();
    router.dismissAll();
  };

  return (
    <View className="flex-1 justify-end">
      {/* Tapping the dimmed area behind the sheet is the expected way out. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={() => router.back()}
        className="absolute inset-0 bg-overlay/40"
      />

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })}>
        <View
          className="gap-4 rounded-t-[20px] bg-surface px-4 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="items-center pb-1">
            <View className="h-1 w-10 rounded-pill bg-border-strong" />
          </View>

          <Text variant="headline">Trip details</Text>

          <Input
            placeholder="Trip name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            autoFocus
            returnKeyType="done"
          />

          <View className="flex-row gap-3">
            <DateField placeholder="Start date" value={startsOn} onChange={setStartsOn} />
            <DateField
              placeholder="End date"
              value={endsOn}
              onChange={setEndsOn}
              minimumDate={startsOn ? new Date(startsOn) : undefined}
            />
          </View>

          <View className="flex-row items-center justify-between gap-4 py-1">
            <Text variant="body" className="flex-1">
              I&apos;ve completed this trip
            </Text>
            <Switch
              value={completed}
              onValueChange={setCompleted}
              accessibilityLabel="I've completed this trip"
            />
          </View>

          {error ? (
            <Text variant="footnote" className="text-danger">
              {error}
            </Text>
          ) : null}

          <View className="gap-3 pt-1">
            <Button label="Save" size="lg" onPress={save} />
            <Button label="Cancel" variant="secondary" size="lg" onPress={() => router.back()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
