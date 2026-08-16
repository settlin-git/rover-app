import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

const tones = {
  neutral: { container: 'bg-surface-sunken', label: 'text-content-secondary' },
  brand: { container: 'bg-brand-subtle', label: 'text-brand' },
  success: { container: 'bg-success/15', label: 'text-success' },
  warning: { container: 'bg-warning/15', label: 'text-warning' },
  danger: { container: 'bg-danger/15', label: 'text-danger' },
} as const;

export type BadgeTone = keyof typeof tones;

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ label, tone = 'neutral', className }: BadgeProps) {
  return (
    <View className={cn('self-start rounded-pill px-2.5 py-1', tones[tone].container, className)}>
      <Text variant="caption" className={tones[tone].label}>
        {label}
      </Text>
    </View>
  );
}
