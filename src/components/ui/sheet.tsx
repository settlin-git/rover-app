import { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { shadow } from '@/theme';

const SPRING = { damping: 20, stiffness: 220, mass: 0.6 };

export type SheetProps = {
  /** Visible heights in points: [collapsed, expanded]. */
  snapPoints: [number, number];
  index: 0 | 1;
  onIndexChange: (index: 0 | 1) => void;
  children: React.ReactNode;
  className?: string;
};

/**
 * A two-position panel anchored to the bottom of the screen.
 *
 * The drag gesture is attached to the grab handle alone, not the whole sheet.
 * That is deliberate: the content is a reorderable list with its own drag
 * gesture, and a sheet that also responded to drags anywhere would steal every
 * attempt to move a row. Restricting the sheet to its handle keeps the two
 * interactions unambiguous.
 */
export function Sheet({ snapPoints, index, onIndexChange, children, className }: SheetProps) {
  const [collapsed, expanded] = snapPoints;
  const travel = Math.max(0, expanded - collapsed);

  // 0 = fully expanded, `travel` = collapsed. Driving the sheet by how far it
  // is pushed down keeps the maths the same as the gesture's translation.
  const offset = useSharedValue(index === 1 ? 0 : travel);
  const start = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      start.value = offset.value;
    })
    .onUpdate((event) => {
      offset.value = Math.min(travel, Math.max(0, start.value + event.translationY));
    })
    .onEnd((event) => {
      // Let a flick win over position: a fast downward swipe should close the
      // sheet even if it has barely moved.
      const projected = offset.value + event.velocityY * 0.15;
      const next: 0 | 1 = projected > travel / 2 ? 0 : 1;
      offset.value = withSpring(next === 1 ? 0 : travel, SPRING);
      runOnJS(onIndexChange)(next);
    });

  // The parent owns `index`, so the sheet animates to whatever it is told. This
  // covers both the handle tap and the gesture, which reports its result
  // upwards and comes back through here.
  useEffect(() => {
    offset.value = withSpring(index === 1 ? 0 : travel, SPRING);
  }, [index, travel, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View
      style={[{ height: expanded }, shadow.sheet, animatedStyle]}
      className={cn('absolute inset-x-0 bottom-0 rounded-t-[20px] bg-surface', className)}>
      <GestureDetector gesture={pan}>
        {/* Tall enough to be an easy target; the visible bar inside is small. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={index === 1 ? 'Collapse panel' : 'Expand panel'}
          onPress={() => onIndexChange(index === 1 ? 0 : 1)}
          className="items-center pb-1 pt-3">
          <View className="h-1 w-10 rounded-pill bg-border-strong" />
        </Pressable>
      </GestureDetector>

      {children}
    </Animated.View>
  );
}
