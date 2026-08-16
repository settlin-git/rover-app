import Ionicons from '@expo/vector-icons/Ionicons';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme';

export default function PeopleScreen() {
  const colors = useThemeColors();

  return (
    <Screen>
      <Text variant="display">People</Text>
      <EmptyState
        icon={<Ionicons name="people-outline" size={26} color={colors['content-tertiary']} />}
        title="Find other travellers"
        description="Search and following are not built yet. The profile screen on the Trips tab shows how another traveller will look."
      />
    </Screen>
  );
}
