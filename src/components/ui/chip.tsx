import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type ChipProps = Omit<PressableProps, 'children'> & {
  label: string;
  /** Filled in the accent colour when on, outlined when off. */
  active?: boolean;
  className?: string;
};

/**
 * A pill-shaped toggle. Used for "Suggest places", where the filled state
 * signals that suggestions are currently being shown in the list below.
 */
export function Chip({ label, active = false, className, ...props }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className={cn(
        'h-10 items-center justify-center rounded-pill px-4',
        active
          ? 'bg-accent active:bg-accent-hover'
          : 'border border-border bg-surface active:bg-surface-subtle',
        className
      )}
      {...props}>
      <Text variant="footnote" className={cn('font-semibold', active && 'text-on-accent')}>
        {label}
      </Text>
    </Pressable>
  );
}
