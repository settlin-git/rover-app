import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

export type CardProps = ViewProps & {
  /** `raised` sits above the page, `outlined` sits flat with a border. */
  variant?: 'raised' | 'outlined';
};

export function Card({ variant = 'raised', className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'gap-2 rounded-card p-4',
        variant === 'raised' ? 'bg-surface' : 'border border-border bg-transparent',
        className
      )}
      {...props}
    />
  );
}
