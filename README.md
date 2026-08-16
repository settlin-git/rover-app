# Rover

A mobile app for iPhone and Android, built with Expo and React Native, set up so
that Figma designs can be turned into working screens with AI assistance.

**New here? Start with [docs/00-start-here.md](docs/00-start-here.md).** It is
written for someone who has never run a line of code, and it walks through
everything in order.

## What is already set up

- **Expo SDK 57** — run the app on a real phone without Xcode or Android Studio
- **Expo Router** — the file structure in `src/app/` *is* the app's navigation
- **NativeWind** — style with Tailwind classes instead of stylesheets
- **A design token system** — one file, `src/theme/tokens.js`, holds every
  colour, corner radius and font size, in both light and dark mode
- **A starter component library** — `Screen`, `Text`, `Button`, `Card`, `Badge`
- **Cursor rules and the Figma MCP connection** — so the AI reads your actual
  design file and follows this project's conventions

The three example screens are demonstrations. Replace them with your own.

## Quick start

Assumes Node.js 22.13+ and the Expo Go app on your phone. If you have neither,
go to [docs/02-install.md](docs/02-install.md) first.

```bash
npm install
npm start
```

Scan the QR code with your phone's camera (iPhone) or the Expo Go app (Android).
The app opens on your phone and reloads every time you save a file.

## Commands

| Command             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm start`         | Start the dev server and show the QR code               |
| `npm run ios`       | Open in the iOS simulator (Mac only)                    |
| `npm run android`   | Open in the Android emulator                            |
| `npm run web`       | Open in a browser — quick previews only, not the real thing |
| `npm run tokens`    | Rebuild styles after editing `src/theme/tokens.js`      |
| `npm run typecheck` | Check for type errors                                   |
| `npm run lint`      | Check for code problems                                 |
| `npm run doctor`    | Check that dependencies match the Expo SDK              |

## Where things live

```
src/
  app/              Every file here is a screen. The folders are the navigation.
    (tabs)/         The bottom tab bar
    trip/[id].tsx   A screen that takes an ID, e.g. /trip/coast-road
  components/
    ui/             Reusable design-system pieces: Button, Card, Text, Badge
    trip-card.tsx   Feature components that know about your data
  theme/
    tokens.js       Every colour, radius and font size. Start here to rebrand.
  data/             Where data comes from. Fake for now, a database later.
  lib/              Small helpers
docs/               The full guide, in order
.cursor/rules/      Instructions the AI follows automatically
```

## The guide

| Doc                                                            | What it covers                                     |
| -------------------------------------------------------------- | -------------------------------------------------- |
| [00 — Start here](docs/00-start-here.md)                        | The whole plan and how long each stage takes        |
| [01 — Concepts](docs/01-concepts.md)                            | What all the words mean, for designers              |
| [02 — Install your tools](docs/02-install.md)                   | Every install, in order, Mac and Windows            |
| [03 — Run the app](docs/03-run-the-app.md)                      | Get it onto your phone                              |
| [04 — The stack](docs/04-the-stack.md)                          | What each library does and why it was chosen        |
| [05 — Figma to code](docs/05-figma-to-code.md)                  | Connect Figma to Cursor and build from your designs |
| [06 — Design tokens](docs/06-design-tokens.md)                  | Turn your Figma variables into the app's styles     |
| [07 — Build your first screen](docs/07-build-your-first-screen.md) | A complete worked example                        |
| [08 — Working with AI](docs/08-working-with-ai.md)              | Prompting, reviewing, and not breaking things       |
| [09 — Add a backend](docs/09-backend.md)                        | Accounts and a real database                        |
| [10 — Ship it](docs/10-ship.md)                                 | TestFlight, the App Store and Google Play           |
| [11 — Troubleshooting](docs/11-troubleshooting.md)              | Fixes for the errors you will actually hit          |
