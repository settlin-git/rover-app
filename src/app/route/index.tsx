import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import ReorderableList, { reorderItems, useReorderableDrag } from 'react-native-reorderable-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RouteMap } from '@/components/map/route-map';
import { PlaceRow } from '@/components/route/place-row';
import { RouteHeader } from '@/components/route/route-header';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SearchField } from '@/components/ui/search-field';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import type { Place, Suggestion } from '@/data/places';
import { useRoute } from '@/features/route/route-store';
import { shadow, useThemeColors } from '@/theme';

type ListItem =
  | { key: string; kind: 'stop'; place: Place }
  | { key: string; kind: 'suggestion'; suggestion: Suggestion };

/**
 * Wrapper that turns the row's handle into a drag trigger.
 *
 * `useReorderableDrag` only works inside the list's own render tree, which is
 * why this exists rather than the hook being called in PlaceRow.
 */
function DraggableStop({
  place,
  connected,
  onRemove,
}: {
  place: Place;
  connected: boolean;
  onRemove: () => void;
}) {
  const drag = useReorderableDrag();
  return <PlaceRow place={place} connected={connected} onRemove={onRemove} onDragStart={drag} />;
}

export default function CreateRouteScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const {
    places,
    suggestions,
    suggestionsVisible,
    suggestionsLoading,
    removePlace,
    setPlaces,
    toggleSuggestions,
    hideSuggestions,
    acceptSuggestion,
  } = useRoute();

  const [sheetIndex, setSheetIndex] = useState<0 | 1>(1);

  /** Stops, with any suggestions sitting in the slot they would occupy. */
  const items = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];

    for (const place of places) {
      result.push({ key: `stop-${place.id}`, kind: 'stop', place });

      if (!suggestionsVisible) continue;

      for (const suggestion of suggestions) {
        if (suggestion.afterPlaceId === place.id) {
          result.push({
            key: `suggestion-${suggestion.place.id}`,
            kind: 'suggestion',
            suggestion,
          });
        }
      }
    }

    return result;
  }, [places, suggestions, suggestionsVisible]);

  /** The route as it would be with every suggestion taken. */
  const previewPlaces = useMemo(() => {
    if (!suggestionsVisible || suggestions.length === 0) return undefined;
    return items.map((item) => (item.kind === 'stop' ? item.place : item.suggestion.place));
  }, [items, suggestions.length, suggestionsVisible]);

  const sheetExpanded = Math.min(height * 0.58, 520);
  const sheetCollapsed = 28;
  const showFullSearch = places.length === 0 || sheetIndex === 0;

  const handleReorder = ({ from, to }: { from: number; to: number }) => {
    const reordered = reorderItems(items, from, to);
    setPlaces(
      reordered
        .filter((item): item is Extract<ListItem, { kind: 'stop' }> => item.kind === 'stop')
        .map((item) => item.place)
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <RouteHeader title="Create Route" onClose={() => router.back()} />

      <View className="flex-1">
        <RouteMap places={places} previewPlaces={previewPlaces} />

        {showFullSearch ? (
          <View className="absolute inset-x-4 top-4">
            <SearchField floating onPress={() => router.push('/route/search')} />
          </View>
        ) : (
          <View className="absolute right-4 top-4" style={shadow.floating}>
            <IconButton
              accessibilityLabel="Search for a place"
              variant="floating"
              size="lg"
              onPress={() => router.push('/route/search')}>
              <Ionicons name="search" size={20} color={colors.content} />
            </IconButton>
          </View>
        )}

        {places.length === 0 ? (
          <View className="absolute inset-x-0 bottom-0" style={shadow.sheet}>
            <View
              className="rounded-t-[20px] bg-surface pt-2"
              style={{ paddingBottom: insets.bottom + 8 }}>
              <View className="items-center pb-1 pt-1">
                <View className="h-1 w-10 rounded-pill bg-border-strong" />
              </View>
              <EmptyState
                icon={<Ionicons name="location-outline" size={26} color={colors.accent} />}
                title="Add your first stop"
                description="Search for a city to start building this route."
                action={
                  <Button
                    label="Search places"
                    variant="primary"
                    onPress={() => router.push('/route/search')}
                  />
                }
              />
            </View>
          </View>
        ) : (
          <Sheet
            snapPoints={[sheetCollapsed, sheetExpanded]}
            index={sheetIndex}
            onIndexChange={setSheetIndex}>
            <View className="flex-row items-center gap-3 px-4 pb-2 pt-1">
              {suggestionsVisible ? (
                <IconButton
                  accessibilityLabel="Dismiss suggestions"
                  variant="plain"
                  size="sm"
                  className="border border-accent"
                  onPress={hideSuggestions}>
                  <Ionicons name="close" size={16} color={colors.accent} />
                </IconButton>
              ) : null}

              <Chip
                label="Suggest places"
                active={suggestionsVisible}
                onPress={toggleSuggestions}
              />

              {suggestionsLoading ? <ActivityIndicator size="small" /> : null}
            </View>

            <ReorderableList
              data={items}
              keyExtractor={(item) => item.key}
              onReorder={handleReorder}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 8 }}
              renderItem={({ item, index }) => {
                if (item.kind === 'suggestion') {
                  return (
                    <PlaceRow
                      place={item.suggestion.place}
                      kind="suggestion"
                      connected={index < items.length - 1}
                      onAdd={() => acceptSuggestion(item.suggestion)}
                    />
                  );
                }

                return (
                  <DraggableStop
                    place={item.place}
                    connected={index < items.length - 1}
                    onRemove={() => removePlace(item.place.id)}
                  />
                );
              }}
            />

            <View
              className="border-t border-border px-4 pt-3"
              style={{ paddingBottom: insets.bottom + 8 }}>
              <Button
                label="Next"
                size="lg"
                onPress={() => router.push('/route/details')}
                disabled={places.length < 2}
              />
              {places.length < 2 ? (
                <Text variant="caption" className="mt-2 text-center">
                  Add at least two stops to continue
                </Text>
              ) : null}
            </View>
          </Sheet>
        )}
      </View>
    </View>
  );
}
