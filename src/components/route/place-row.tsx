import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { Place } from '@/data/places';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/theme';

export type PlaceRowProps = {
  place: Place;
  /**
   * `stop` is a place already on the route; `suggestion` is one being offered.
   * Suggestions sit inline at the position they would take, so their effect on
   * the route is obvious before they are accepted.
   */
  kind?: 'stop' | 'suggestion';
  /** Draws the connector down to the next row. False on the last one. */
  connected?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  /** Begins a drag. Wired to the handle only, never the whole row. */
  onDragStart?: () => void;
  className?: string;
};

/** Pin plus the line joining it to the next stop, forming a continuous route. */
function Timeline({ kind, connected }: { kind: 'stop' | 'suggestion'; connected: boolean }) {
  const colors = useThemeColors();
  const tint = kind === 'suggestion' ? colors.accent : colors.route;

  return (
    <View className="w-6 items-center self-stretch">
      <Ionicons
        name={kind === 'suggestion' ? 'location-outline' : 'location'}
        size={18}
        color={tint}
      />
      {connected ? <View className="mt-1 w-0.5 flex-1 rounded-pill bg-border" /> : null}
    </View>
  );
}

export function PlaceRow({
  place,
  kind = 'stop',
  connected = false,
  onAdd,
  onRemove,
  onDragStart,
  className,
}: PlaceRowProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        'flex-row items-start gap-3 px-4 py-3',
        kind === 'suggestion' && 'bg-surface-subtle',
        className
      )}>
      <Timeline kind={kind} connected={connected} />

      <View className="flex-1 pb-1">
        <Text variant="body" className="font-semibold" numberOfLines={1}>
          {place.name}
        </Text>
        <Text variant="footnote" numberOfLines={1}>
          {place.region}
        </Text>
      </View>

      <View className="flex-row items-center gap-4 pt-1">
        {kind === 'stop' && onDragStart ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Reorder ${place.name}`}
            accessibilityHint="Press and hold, then drag up or down"
            hitSlop={10}
            // Long press rather than tap: a stray tap while scrolling should
            // not pick a row up.
            onLongPress={onDragStart}
            delayLongPress={150}>
            <Ionicons name="reorder-three" size={22} color={colors.content} />
          </Pressable>
        ) : null}

        {kind === 'stop' && onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${place.name}`}
            hitSlop={10}
            onPress={onRemove}>
            <Ionicons name="remove-circle-outline" size={22} color={colors.content} />
          </Pressable>
        ) : null}

        {kind === 'suggestion' && onAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${place.name} to route`}
            hitSlop={10}
            onPress={onAdd}>
            <Ionicons name="add-circle-outline" size={22} color={colors.accent} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
