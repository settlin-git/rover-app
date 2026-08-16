import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme';

export default function FeedScreen() {
  const colors = useThemeColors();

  return (
    <Screen>
      <Text variant="display">Feed</Text>

      <EmptyState
        icon={<Ionicons name="reorder-three-outline" size={26} color={colors['content-tertiary']} />}
        title="Nothing here yet"
        description="Trips from the people you follow will show up here once this screen is built."
        action={
          <Link href="/gallery" asChild>
            <Button label="View component gallery" variant="secondary" size="sm" />
          </Link>
        }
      />

      <View className="items-center">
        <Text variant="caption">Placeholder screen</Text>
      </View>
    </Screen>
  );
}
