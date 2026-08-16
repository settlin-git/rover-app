import { View } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * A hairline rule. Uses a 1px filled view rather than a border so that stacking
 * several rows never doubles the line thickness where two borders meet.
 */
export function Divider({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <View
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  );
}
