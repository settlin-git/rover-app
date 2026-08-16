# 04 — The stack

What each piece is, why it was chosen over the alternatives, and what it would
cost you to change your mind later.

## The short version

| Layer      | Choice                | Why                                                            |
| ---------- | --------------------- | --------------------------------------------------------------- |
| Framework  | Expo (React Native 0.86) | One codebase for iOS and Android; runs on your phone without Xcode |
| Language   | TypeScript            | Catches mistakes before you run the app, and AI writes it better  |
| Navigation | Expo Router           | The folder structure is the navigation                            |
| Styling    | NativeWind (Tailwind) | Short class names that map cleanly onto Figma's model             |
| Icons      | `@expo/vector-icons`  | Thousands of icons, already installed                             |
| Backend    | Supabase (later)      | A real database and accounts without running a server             |
| Builds     | EAS                   | Produces App Store and Play Store files in the cloud              |

## Framework: why Expo

The genuine contenders for a designer building a real mobile app:

| Option                       | Verdict for you                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **Expo / React Native**      | **Chosen.** One codebase, real native UI, runs on your phone in seconds, biggest AI training corpus of any mobile stack. |
| Flutter                      | Excellent framework, but Dart is a language you would have to learn, and AI models write far more React Native than Flutter. Its widgets also draw their own controls rather than using the platform's. |
| Native Swift + Kotlin        | The best possible result and roughly twice the work — two codebases, two languages, and a Mac required for the iOS half. |
| Capacitor / Ionic            | Wraps a website in an app shell. Quick to start, but scrolling and gestures never feel quite right, and that gap is exactly what a designer will notice. |

The specific reasons Expo wins for someone in your position:

**You can run the app on your phone in seconds.** Install Expo Go, scan a QR
code, done. No Xcode, no Android Studio, no provisioning profiles until you are
ready to ship to other people. This alone removes the wall most people hit on
day one.

**Save and see.** Change a value, save, and the phone updates in about a second.
That is a design feedback loop, and it is why building UI this way feels
familiar rather than alien.

**AI models are exceptionally good at it.** React and React Native make up an
enormous share of public code, so the AI's suggestions are more likely to be
correct and idiomatic here than in any other mobile stack. When your main tool is
an AI, that is not a small advantage.

**The interface is genuinely native.** React Native renders real iOS and Android
components. A button feels like a button, scrolling has the right physics.

**Expo handles the tedious parts.** Camera, notifications, location, secure
storage, over-the-air updates, and cloud builds are all first-party. The gap
between Expo and bare React Native used to be a real trade-off; it now mostly
is not.

The honest trade-off: for something extremely performance-sensitive — a 3D game,
heavy real-time video processing — native code still wins. For the apps
designers usually want to build, it is not close.

## Language: TypeScript

JavaScript with labels describing what kind of value each thing holds.

```tsx
// Plain JavaScript: nothing stops you passing the wrong thing.
function Badge(props) { ... }

// TypeScript: the mistake is caught as you type it.
function Badge(props: { label: string; tone?: BadgeTone }) { ... }
```

Two reasons this matters more for you than for an experienced developer. It
catches errors at the moment you write them rather than as a crash on your phone
ten minutes later. And it makes AI-generated code dramatically more reliable,
because the AI can see the exact shape of every component it is using instead of
inferring it.

`npm run typecheck` checks the whole project at once.

## Navigation: Expo Router

The file structure *is* the navigation:

```
src/app/(tabs)/index.tsx      →  the first tab
src/app/(tabs)/profile.tsx    →  the second tab
src/app/trip/[id].tsx         →  /trip/coast-road, /trip/alpine-loop, ...
```

Create a file, get a screen. Folders in parentheses group screens without
appearing in the URL. Square brackets mean "this part varies".

The alternative, React Navigation, is what Expo Router is built on top of, and
requires you to declare every screen in a central configuration file. Expo Router
is less to hold in your head and much easier to describe to an AI, since "add a
screen" becomes "add a file".

## Styling: NativeWind

You write class names instead of stylesheets:

```tsx
// NativeWind
<View className="flex-row items-center gap-3 rounded-card bg-surface p-4">

// The same thing with React Native's built-in styling
<View style={styles.container} />
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, backgroundColor: '#FFFFFF', padding: 16,
  },
});
```

The alternatives, and why they lost:

| Option                   | Why not                                                                    |
| ------------------------ | --------------------------------------------------------------------------- |
| `StyleSheet` (built in)  | Works fine, but every component ends up twice as long, and each screen tends to reinvent its own spacing values. |
| Tamagui                  | Powerful and fast, but a large API to learn and much less familiar to AI models. |
| Unistyles                | Good, and closer to plain React Native, but a smaller ecosystem and fewer examples. |

NativeWind wins on three counts. Styles sit next to the thing they style, so you
read a component top to bottom without jumping. The constrained scale — `p-4`,
`gap-3` — quietly prevents the drift into 13px and 17px paddings. And AI models
write Tailwind extremely well, including Figma's own code output, which is
already Tailwind-shaped.

### A version note

This project uses **NativeWind v4**, the stable release. A v5 preview exists,
built on Tailwind v4 with CSS-based configuration. Two reasons to stay on v4 for
now: v4 is stable while v5 is still a preview, and v4 keeps a
`tailwind.config.js` file, which is a far better place for a designer to see the
whole token set at a glance than CSS.

If you do try v5 later, expect one non-obvious failure. Tailwind v4 and
NativeWind's CSS engine can end up on different versions of an internal library
called `lightningcss`, and the build fails with
`failed to deserialize; expected an object-like struct named Specifier` — an
error that says nothing about the actual cause. The fix is to pin the version by
adding this to `package.json` and reinstalling:

```json
"overrides": { "lightningcss": "1.30.1" }
```

## Icons: `@expo/vector-icons`

Several thousand icons, already installed, no per-icon work:

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';

<Ionicons name="map-outline" size={20} color={colors.brand} />
```

Browse the full set at [icons.expo.fyi](https://icons.expo.fyi). Ionicons suits
mobile best; the package includes Material, Feather and others.

For your own custom icons drawn in Figma, export as SVG and add
`react-native-svg`. Do that when you actually need it.

## What is deliberately not here yet

Every dependency is a thing that can break, so this project starts small. Add
these when you have a concrete need, not in advance.

| Need                    | Reach for                                       |
| ----------------------- | ------------------------------------------------ |
| Accounts and a database | Supabase — [doc 09](09-backend.md)              |
| Fetching remote data    | TanStack Query                                   |
| Shared app-wide state   | Zustand — but React's built-in state covers most cases |
| Forms and validation    | React Hook Form + Zod                            |
| Animation               | `react-native-reanimated`, already installed     |
| Bottom sheets           | `@gorhom/bottom-sheet`                           |
| Custom icons or SVG art | `react-native-svg`                               |

Install with `npx expo install <package>`, never plain `npm install`. Only the
Expo command picks the version that matches your SDK; using npm directly is a
reliable way to produce an app that builds fine and crashes on launch.

## How the pieces fit together

```
        src/theme/tokens.js
       (colours, radii, type)
                 |
    +------------+-------------+
    |                          |
tailwind.config.js      npm run tokens
 (defines classes)             |
    |                    src/global.css
    |                  (CSS variables, generated)
    +------------+-------------+
                 |
        className="bg-surface"
                 |
      src/components/ui/  (Button, Card, Text, Badge)
                 |
        src/components/  (TripCard — knows about your data)
                 |
          src/app/  (screens, and therefore navigation)
```

Read it bottom to top and it is the answer to "why is this button indigo": the
screen uses a component, which uses a class, which resolves to a CSS variable,
which was generated from a token. One value, one place, one edit.

---

Next: [05 — Figma to code](05-figma-to-code.md)
