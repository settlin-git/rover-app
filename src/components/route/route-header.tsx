import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme';

/**
 * Title bar for the builder. Written by hand rather than using the navigator's
 * header so the map can sit directly beneath it with nothing in between.
 */
export function RouteHeader({ title, onClose }: { title: string; onClose: () => void }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-surface">
      <View className="h-14 flex-row items-center justify-center px-2">
        <Text variant="body" className="font-semibold">
          {title}
        </Text>
        <View className="absolute right-2">
          <IconButton accessibilityLabel="Close" variant="plain" onPress={onClose}>
            <Ionicons name="close" size={26} color={colors.content} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}
