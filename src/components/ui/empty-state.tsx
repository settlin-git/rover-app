import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  /** Say what the user can do next. A blank screen with a noun is not enough. */
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <View className={cn('items-center gap-3 px-8 py-12', className)}>
      {icon ? (
        <View className="h-14 w-14 items-center justify-center rounded-pill bg-surface-subtle">
          {icon}
        </View>
      ) : null}
      <Text variant="headline" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text variant="footnote" className="text-center">
          {description}
        </Text>
      ) : null}
      {action ? <View className="mt-2">{action}</View> : null}
    </View>
  );
}
