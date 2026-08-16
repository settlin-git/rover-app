import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';
import { shadow, useThemeColors } from '@/theme';

export type SearchFieldProps = Omit<TextInputProps, 'className'> & {
  /**
   * Renders as a button rather than a live input. The search overlay on the map
   * uses this: tapping it opens the dedicated search screen instead of raising
   * the keyboard over the map.
   */
  onPress?: () => void;
  /** Lifts the field off a map with a shadow. */
  floating?: boolean;
  className?: string;
};

export function SearchField({
  onPress,
  floating = false,
  placeholder = 'Search',
  className,
  ...props
}: SearchFieldProps) {
  const colors = useThemeColors();

  const field = (
    <View
      style={floating ? shadow.floating : undefined}
      className={cn(
        'h-14 flex-row items-center gap-3 rounded-pill bg-surface px-5',
        !floating && 'border border-border',
        className
      )}>
      <Ionicons name="search" size={20} color={colors['content-tertiary']} />
      <TextInput
        className="flex-1 text-body text-content"
        placeholder={placeholder}
        placeholderTextColor={colors['content-tertiary']}
        returnKeyType="search"
        autoCorrect={false}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        {...props}
      />
    </View>
  );

  if (!onPress) return field;

  return (
    <Pressable accessibilityRole="search" accessibilityLabel={placeholder} onPress={onPress}>
      {field}
    </Pressable>
  );
}
