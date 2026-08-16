import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function ProfileScreen() {
  return (
    <Screen>
      <View className="gap-1">
        <Text variant="caption">Account</Text>
        <Text variant="display">Profile</Text>
      </View>

      <Card>
        <Text variant="headline">Sam Rivera</Text>
        <Text variant="footnote">sam@example.com</Text>
        <Badge label="Free plan" tone="brand" className="mt-1" />
      </Card>

      <Card variant="outlined">
        <Text variant="headline">Component gallery</Text>
        <Text variant="footnote">
          Every style below comes from src/theme/tokens.js. Change a value there, run npm run
          tokens, and it updates everywhere at once.
        </Text>

        <View className="mt-2 gap-3">
          <Button label="Primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Danger" variant="danger" />
          <Button label="Loading" loading />
          <Button label="Disabled" disabled />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <Badge label="neutral" />
          <Badge label="brand" tone="brand" />
          <Badge label="success" tone="success" />
          <Badge label="warning" tone="warning" />
          <Badge label="danger" tone="danger" />
        </View>
      </Card>
    </Screen>
  );
}
