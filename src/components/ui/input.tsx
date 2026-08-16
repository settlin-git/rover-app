import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';
import { useThemeColors } from '@/theme';

export type InputProps = Omit<TextInputProps, 'className'> & {
  /** Shown at the trailing edge, e.g. a calendar icon on a date field. */
  trailing?: React.ReactNode;
  /**
   * Turns the field into a button. Use for values chosen from a picker rather
   * than typed, so the keyboard never appears for a date.
   */
  onPress?: () => void;
  className?: string;
};

export function Input({ trailing, onPress, className, ...props }: InputProps) {
  const colors = useThemeColors();

  const field = (
    <View
      className={cn(
        'h-14 flex-row items-center gap-2 rounded-field border border-border bg-field px-4',
        className
      )}>
      <TextInput
        className="flex-1 text-body text-content"
        placeholderTextColor={colors['content-tertiary']}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        {...props}
      />
      {trailing}
    </View>
  );

  if (!onPress) return field;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.placeholder}
      onPress={onPress}>
      {field}
    </Pressable>
  );
}
