import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View } from 'react-native';

import { PlaceRow } from '@/components/route/place-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Divider } from '@/components/ui/divider';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { Stat } from '@/components/ui/stat';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { getPlace } from '@/data/places';
import { useThemeColors } from '@/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3">
      <Text variant="caption">{title}</Text>
      {children}
    </Card>
  );
}

/**
 * Every component in one place, so a design change can be checked against the
 * whole set at once rather than hunting for a screen that happens to use it.
 * Not reachable from the tab bar: open /gallery directly.
 */
export default function GalleryScreen() {
  const colors = useThemeColors();
  const [suggesting, setSuggesting] = useState(true);
  const [on, setOn] = useState(true);
  const place = getPlace('new-delhi');

  return (
    <Screen>
      <Text variant="display">Components</Text>
      <Text variant="footnote">
        Everything here is styled from src/theme/tokens.js. Change a value there, run npm run
        tokens, and this whole screen updates.
      </Text>

      <Section title="Type scale">
        <Text variant="display">Display</Text>
        <Text variant="title">Title</Text>
        <Text variant="headline">Headline</Text>
        <Text variant="body">Body</Text>
        <Text variant="footnote">Footnote</Text>
        <Text variant="caption">Caption</Text>
      </Section>

      <Section title="Buttons">
        <Button label="Primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Accent" variant="accent" />
        <Button label="Ghost" variant="ghost" />
        <Button label="Danger" variant="danger" />
        <Button label="Loading" loading />
        <Button label="Disabled" disabled />
      </Section>

      <Section title="Icon buttons">
        <View className="flex-row items-center gap-3">
          <IconButton accessibilityLabel="Subtle">
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.content} />
          </IconButton>
          <IconButton accessibilityLabel="Floating" variant="floating">
            <Ionicons name="search" size={18} color={colors.content} />
          </IconButton>
          <IconButton accessibilityLabel="Plain" variant="plain">
            <Ionicons name="close" size={22} color={colors.content} />
          </IconButton>
        </View>
      </Section>

      <Section title="Chips and badges">
        <View className="flex-row flex-wrap items-center gap-2">
          <Chip label="Suggest places" active={suggesting} onPress={() => setSuggesting((v) => !v)} />
          <Chip label="Inactive" />
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Badge label="neutral" />
          <Badge label="accent" tone="accent" />
          <Badge label="success" tone="success" />
          <Badge label="warning" tone="warning" />
          <Badge label="danger" tone="danger" />
        </View>
      </Section>

      <Section title="Fields">
        <SearchField placeholder="Search" />
        <Input placeholder="Trip name" />
        <View className="flex-row items-center justify-between">
          <Text variant="body">Switch</Text>
          <Switch value={on} onValueChange={setOn} accessibilityLabel="Example switch" />
        </View>
      </Section>

      <Section title="Stats">
        <View className="flex-row items-center justify-between">
          <Stat
            icon={<Ionicons name="location-outline" size={16} color={colors['content-secondary']} />}
            label="I'm in"
            value="New Delhi"
            labelPosition="before"
            className="flex-1"
          />
          <Divider orientation="vertical" className="h-8" />
          <Stat
            icon={<Ionicons name="earth-outline" size={16} color={colors['content-secondary']} />}
            value="32"
            label="Countries"
            className="flex-1"
          />
        </View>
      </Section>

      {place ? (
        <Section title="Place rows">
          <View className="-mx-4">
            <PlaceRow place={place} connected onRemove={() => {}} onDragStart={() => {}} />
            <PlaceRow place={place} kind="suggestion" onAdd={() => {}} />
          </View>
        </Section>
      ) : null}
    </Screen>
  );
}
