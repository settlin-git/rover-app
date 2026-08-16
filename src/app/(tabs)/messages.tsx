import Ionicons from '@expo/vector-icons/Ionicons';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme';

export default function MessagesScreen() {
  const colors = useThemeColors();

  return (
    <Screen>
      <Text variant="display">Messages</Text>
      <EmptyState
        icon={<Ionicons name="chatbox-outline" size={26} color={colors['content-tertiary']} />}
        title="No conversations"
        description="Messaging needs a backend before it can do anything. See docs/09-backend.md."
      />
    </Screen>
  );
}
