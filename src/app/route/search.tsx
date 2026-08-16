import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SearchField } from '@/components/ui/search-field';
import { Text } from '@/components/ui/text';
import { type Place, searchPlaces } from '@/data/places';
import { useRoute } from '@/features/route/route-store';
import { useThemeColors } from '@/theme';

function ResultRow({
  place,
  added,
  onAdd,
}: {
  place: Place;
  added: boolean;
  onAdd: () => void;
}) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={added ? `${place.name}, already on route` : `Add ${place.name}`}
      accessibilityState={{ disabled: added }}
      disabled={added}
      onPress={onAdd}
      className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-subtle">
      <View className="flex-1">
        <Text variant="body" className="font-semibold" numberOfLines={1}>
          {place.name}
        </Text>
        <Text variant="footnote" numberOfLines={1}>
          {place.region}
        </Text>
      </View>

      <Ionicons
        name={added ? 'checkmark-circle' : 'add-circle-outline'}
        size={24}
        color={added ? colors.success : colors.accent}
      />
    </Pressable>
  );
}

export default function SearchPlacesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { places, addPlace } = useRoute();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Wait for a pause in typing before searching, so a five-letter city does
    // not fire five requests.
    const timer = setTimeout(() => {
      searchPlaces(query)
        .then((found) => {
          if (!cancelled) setResults(found);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const onRoute = new Set(places.map((place) => place.id));
  const trimmed = query.trim();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-surface">
      <View className="flex-row justify-end px-2 pt-1">
        <IconButton accessibilityLabel="Close search" variant="plain" onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.content} />
        </IconButton>
      </View>

      <View className="px-4 pb-3">
        <SearchField
          value={query}
          onChangeText={(text) => {
            setSearching(true);
            setQuery(text);
          }}
          autoFocus
          placeholder="Search"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(place) => place.id}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <Divider className="ml-4" />}
        renderItem={({ item }) => (
          <ResultRow
            place={item}
            added={onRoute.has(item.id)}
            onAdd={() => {
              addPlace(item);
              router.back();
            }}
          />
        )}
        ListEmptyComponent={
          searching && trimmed.length > 0 ? (
            <ActivityIndicator className="mt-10" />
          ) : trimmed.length > 0 ? (
            <EmptyState
              title={`No places match “${trimmed}”`}
              description="Try a city name. This demo catalogue only covers a handful of places — see src/data/places.ts."
            />
          ) : (
            <EmptyState
              icon={<Ionicons name="search" size={24} color={colors['content-tertiary']} />}
              title="Search for a place"
              description="Cities, regions and countries you want this route to pass through."
            />
          )
        }
      />
    </View>
  );
}
