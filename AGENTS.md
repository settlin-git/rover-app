# Rover

A React Native mobile app built with Expo. This file orients any AI agent
working in the repo; the enforceable conventions live in `.cursor/rules/`.

## Stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Expo SDK 57 (React Native 0.86, React 19.2.3) |
| Language   | TypeScript, strict                            |
| Navigation | Expo Router (file-based, in `src/app/`)       |
| Styling    | NativeWind v4 (Tailwind classes)              |
| Icons      | `@expo/vector-icons` (Ionicons)               |

Expo's APIs change substantially between SDKs. Check
https://docs.expo.dev/versions/v57.0.0/ rather than relying on recalled
patterns, and install packages with `npx expo install` so versions match the SDK.

## Layout

```
src/
  app/            Routes. The file tree is the navigation structure.
  components/ui/  Generic design-system pieces, one per Figma component.
  components/     Feature components that know about app data.
  theme/          tokens.js — the only source of colour, radius and type values.
  data/           Data access. Currently in-memory fixtures.
  lib/            Helpers, including cn() for merging classes.
```

## Commands

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `npm start`         | Dev server; scan the QR code with Expo Go        |
| `npm run tokens`    | Regenerate `src/global.css` after editing tokens |
| `npm run typecheck` | TypeScript                                       |
| `npm run lint`      | ESLint                                           |
| `npm run doctor`    | Check dependency health against the SDK          |

## Non-negotiables

- Style with `className`, never `StyleSheet.create`.
- No literal colours, radii or font sizes — use tokens from `src/theme/tokens.js`.
- `src/global.css` is generated. Edit `tokens.js` and run `npm run tokens`.
- Leave `typecheck` and `lint` passing.

## Working with the person who owns this repo

They are a product designer, new to writing code, and Figma is where the app is
designed. Practical consequences:

- Explain in plain language what you changed and which file it lives in. Skip
  the jargon, or define it the first time you use it.
- Design vocabulary lands better than code vocabulary: "the card's padding"
  reads more clearly than "the container's `p-4` utility".
- When something can be done several ways, pick one, do it, and say what the
  trade-off was. Do not present a menu of options.
- Flag anything that costs money, deletes data, or is hard to undo before doing
  it.
