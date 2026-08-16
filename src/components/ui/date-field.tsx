import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/dates';
import { useThemeColors } from '@/theme';

export type DateFieldProps = {
  /** `YYYY-MM-DD`, or empty for no selection yet. */
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minimumDate?: Date;
  className?: string;
};

/**
 * A date input backed by the platform's own picker.
 *
 * Typing dates is error-prone and the format is never what the user expects, so
 * the field is a button: tapping it opens the wheel on iOS or the calendar
 * dialog on Android. The two platforms differ in how the picker is dismissed,
 * which is the only reason for the `Platform` check below.
 */
export function DateField({
  value,
  onChange,
  placeholder,
  minimumDate,
  className,
}: DateFieldProps) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value) : new Date();

  return (
    <View className={cn('flex-1', className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? `${placeholder}: ${formatDate(value)}` : placeholder}
        onPress={() => setOpen(true)}
        className="h-14 flex-row items-center justify-between gap-2 rounded-field border border-border bg-field px-4 active:bg-surface-subtle">
        <Text
          variant="body"
          className={cn('flex-1', value ? 'text-content' : 'text-content-tertiary')}
          numberOfLines={1}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={colors['content-secondary']} />
      </Pressable>

      {open ? (
        <DateTimePicker
          value={selected}
          mode="date"
          minimumDate={minimumDate}
          display={Platform.select({ ios: 'inline', default: 'default' })}
          onChange={(event, date) => {
            // Android's dialog closes itself and reports dismissal; iOS's inline
            // picker stays put until it is closed here.
            if (Platform.OS !== 'ios') setOpen(false);
            if (event.type === 'dismissed' || !date) return;
            onChange(date.toISOString().slice(0, 10));
          }}
        />
      ) : null}

      {open && Platform.OS === 'ios' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Done choosing date"
          onPress={() => setOpen(false)}
          className="mt-2 items-center py-2">
          <Text variant="footnote" className="font-semibold text-accent">
            Done
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
