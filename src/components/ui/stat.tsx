import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type StatProps = {
  icon: React.ReactNode;
  /** The part that carries the information, emphasised. */
  value: string;
  label: string;
  /**
   * Where the plain-language label sits. "32 Countries" reads value first;
   * "I'm in New Delhi" reads label first.
   */
  labelPosition?: 'before' | 'after';
  className?: string;
};

/** One figure in the row of stats under a profile header. */
export function Stat({ icon, value, label, labelPosition = 'after', className }: StatProps) {
  const labelNode = (
    <Text variant="footnote" className="text-content-secondary">
      {label}
    </Text>
  );

  return (
    <View className={cn('items-center gap-1.5', className)}>
      {icon}
      <View className="flex-row items-baseline gap-1">
        {labelPosition === 'before' ? labelNode : null}
        <Text variant="footnote" className="font-semibold text-content">
          {value}
        </Text>
        {labelPosition === 'after' ? labelNode : null}
      </View>
    </View>
  );
}
