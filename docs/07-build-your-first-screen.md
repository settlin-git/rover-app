# 07 — Build your first screen

A complete worked example, start to finish. We will add a Settings screen: a
third tab, a few rows, and a toggle that actually works.

Follow along literally, even though it is not your design. Doing it once on a
known example means that when you build your own screen you are only solving one
new problem instead of five.

## What we are building

A screen with a heading, two grouped sections of rows, a working toggle, and a
sign-out button. It exercises nearly everything: routing, components, tokens,
state and lists.

## Step 1 — Decide before you type

The habit that separates a coherent app from a pile of screens. Before writing
anything, answer:

**What already exists that I can reuse?** Open `src/components/ui/`. There is
`Screen`, `Text`, `Card`, `Button` and `Badge`. A settings screen is a heading, a
few cards, and rows inside them. The only genuinely new thing is the row.

**What is new, and is it reusable?** A settings row — label on the left,
something on the right — will appear many times. That makes it a component, in
`src/components/ui/`, not something written inline three times.

**Which tokens does it need?** Rows need a divider, so `border`. Text needs
`content` and `content-secondary`. Everything already exists. No new tokens.

Two minutes of this saves an hour later.

## Step 2 — Create the row component

Create `src/components/ui/setting-row.tsx`:

```tsx
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type SettingRowProps = {
  label: string;
  description?: string;
  /** Anything to show on the right: a switch, a chevron, a value. */
  accessory?: React.ReactNode;
  onPress?: () => void;
  className?: string;
};

export function SettingRow({
  label,
  description,
  accessory,
  onPress,
  className,
}: SettingRowProps) {
  const content = (
    <View className={cn('flex-row items-center justify-between gap-4 py-3', className)}>
      <View className="flex-1 gap-0.5">
        <Text variant="body">{label}</Text>
        {description ? <Text variant="footnote">{description}</Text> : null}
      </View>
      {accessory}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {content}
    </Pressable>
  );
}
```

Reading it as a designer:

- `SettingRowProps` is the properties panel: which knobs this component exposes.
  `?` means optional.
- `accessory` is a slot. Anything can go in it — a switch, a chevron, a value —
  which is how one component covers every row in the design.
- The `className` on the outer `View` is auto layout: horizontal, vertically
  centred, label and accessory pushed apart, 16px between them, 12px above and
  below.
- `flex-1` on the label column makes it absorb the leftover width, so the
  accessory sits flush right whatever the label length.
- The `if (!onPress)` line means a row is only tappable when you give it
  something to do. A tappable row that does nothing is a bug users can feel.

## Step 3 — Create the screen

Create `src/app/(tabs)/settings.tsx`:

```tsx
import { useState } from 'react';
import { Switch, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { SettingRow } from '@/components/ui/setting-row';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [offlineMaps, setOfflineMaps] = useState(false);
  const colors = useThemeColors();

  const switchColors = {
    trackColor: { false: colors['surface-sunken'], true: colors.brand },
    thumbColor: colors.surface,
  };

  return (
    <Screen>
      <View className="gap-1">
        <Text variant="caption">Account</Text>
        <Text variant="display">Settings</Text>
      </View>

      <Card>
        <Text variant="caption">Notifications</Text>
        <SettingRow
          label="Push notifications"
          description="Trip reminders and route updates"
          accessory={
            <Switch value={notifications} onValueChange={setNotifications} {...switchColors} />
          }
        />
        <View className="h-px bg-border" />
        <SettingRow
          label="Offline maps"
          description="Download routes for use without signal"
          accessory={
            <Switch value={offlineMaps} onValueChange={setOfflineMaps} {...switchColors} />
          }
        />
      </Card>

      <Card>
        <Text variant="caption">About</Text>
        <SettingRow label="Version" accessory={<Text variant="footnote">1.0.0</Text>} />
        <View className="h-px bg-border" />
        <SettingRow label="Privacy policy" onPress={() => {}} />
      </Card>

      <Button label="Sign out" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}
```

The parts worth understanding:

**`useState`.** `const [notifications, setNotifications] = useState(true)` creates
a value that starts as `true`, plus a function to change it. Calling
`setNotifications(false)` redraws the screen with the new value. This is the
whole idea of state: change the value, the interface follows. In Figma you would
draw two frames and link them; here you change one value.

**`switchColors`.** React Native's `Switch` takes colour strings, not class
names, so this is a legitimate use of `useThemeColors()`. Defining it once and
spreading it with `{...switchColors}` avoids repeating it per switch.

**`<View className="h-px bg-border" />`.** A one-pixel divider. Cheaper and more
predictable than borders on each row, which double up between adjacent rows.

**`onPress={() => {}}`.** A deliberately empty handler — the row is tappable and
does nothing yet. Fine as a placeholder, but do not ship it.

## Step 4 — Add the tab

The file exists, so the route exists. But a tab has to be registered to appear.

In `src/app/(tabs)/_layout.tsx`, add a third entry after the Profile one:

```tsx
<Tabs.Screen
  name="settings"
  options={{
    title: 'Settings',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="settings-outline" color={color} size={size} />
    ),
  }}
/>
```

`name` must match the filename without its extension. Save, and the tab appears
on your phone.

Browse other icon names at [icons.expo.fyi](https://icons.expo.fyi).

## Step 5 — Check your work

Run both checks:

```bash
npm run typecheck
npm run lint
```

Then look at the actual screen:

- Toggle the switches. They should move and stay put.
- Switch your phone to dark mode. Dividers and text should adapt.
- Check a small screen — the iPhone SE size is where long labels wrap.
- Tap the version row. It should not respond, because it has no `onPress`.

## Step 6 — Save a checkpoint

```bash
git add -A
git commit -m "Add settings screen with notification and offline map toggles"
```

Commit whenever something works. It costs seconds and it is the difference
between undoing one experiment and undoing an afternoon.

## Doing the same thing with AI

That was the manual version, so you know what the output should look like. In
practice you would describe it. The prompt that produces comparable quality:

```
Add a Settings screen as a third tab.

Design: <paste your Figma link>

Follow the conventions in .cursor/rules/. Before writing code, tell me which
existing components in src/components/ui/ you will reuse and what new
components you need.
```

Note what makes this work: pointing at the real design, naming the conventions,
and asking for the plan first. Compare it with "make me a settings screen",
which gives the AI nothing to be consistent with and produces something that
looks like a different app.

## The pattern, generalised

Every screen from here follows the same six steps:

1. **Decide** what to reuse, what is new, which tokens are needed.
2. **Build the reusable pieces first**, in `src/components/ui/`.
3. **Assemble the screen** in `src/app/`, keeping it thin.
4. **Wire up navigation** if it needs a tab or a link.
5. **Check** typecheck, lint, dark mode, a small screen.
6. **Commit.**

Screen ten takes a fraction of the time screen one did, because by then the
components exist. Which is why building the component rather than inlining it is
worth the extra two minutes every single time.

---

Next: [08 — Working with AI](08-working-with-ai.md)
