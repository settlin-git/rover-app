import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

export type ScreenProps = {
  children: React.ReactNode;
  /** Set to false for screens that manage their own scrolling, such as lists. */
  scroll?: boolean;
  className?: string;
};

/**
 * Page shell that keeps content clear of the notch, home indicator and status
 * bar. Every screen should be wrapped in one so padding stays consistent.
 */
export function Screen({ children, scroll = true, className }: ScreenProps) {
  const content = <View className={cn('gap-4 p-4', className)}>{children}</View>;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background">
      {scroll ? (
        <ScrollView
          contentContainerClassName="pb-12"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
