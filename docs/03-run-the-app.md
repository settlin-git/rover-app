# 03 — Run the app

Getting this project onto your phone. Ten minutes, most of it downloading.

## 1. Install the project's packages

In Cursor's terminal, from the project folder:

```bash
npm install
```

This reads `package.json` and downloads roughly 600 packages into
`node_modules/`. It takes a minute or two and prints a lot.

You will very likely see a line like `24 vulnerabilities (8 moderate, 16 high)`
at the end. **Ignore it.** npm reports every theoretical issue anywhere in the
dependency tree, including in build tools that never run on a user's phone.
Running `npm audit fix --force`, which it helpfully suggests, is a genuinely
common way to break a working project. Don't.

You only need to run `npm install` again when you pull down someone else's
changes to `package.json`.

## 2. Start the dev server

```bash
npm start
```

You get a QR code and a menu of keyboard shortcuts. Leave this running — it is
the server your phone talks to. To stop it later, click the terminal and press
<kbd>Ctrl</kbd>+<kbd>C</kbd>.

## 3. Open it on your phone

- **iPhone**: open the Camera app, point it at the QR code, tap the notification.
- **Android**: open Expo Go, tap **Scan QR code**, point it at the code.

The first load takes fifteen to thirty seconds while your phone downloads the
JavaScript bundle. After that it is fast.

You should see the Trips screen: three cards, a bottom tab bar, and an indigo
"Plan a new trip" button.

**If it does not connect**, jump to [doc 11](11-troubleshooting.md) — it is
almost always the Wi-Fi issue described there, and there is a one-flag fix.

## 4. Confirm the loop works

This is the point of the whole doc. Everything after depends on it.

1. In Cursor, open `src/app/(tabs)/index.tsx`.
2. Find `Your trips` and change it to `My adventures`.
3. Save (<kbd>Cmd</kbd>+<kbd>S</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>).
4. Watch your phone.

The heading changes in about a second, without the app restarting. That is hot
reload, and it is the loop you will work in from now on: change, save, look.

Change it back when you have seen it.

## Getting around the app

Tap a trip card to open its detail screen, then swipe back. Tap the Profile tab
for a gallery of every component in the design system. Those three screens exist
to be replaced by yours — they are demonstrations, not scaffolding you need to
keep.

## Try dark mode

Switch your phone to dark mode (Control Centre on iPhone, quick settings on
Android). The app follows immediately, because every colour comes from tokens
that define both modes. You will never write dark mode code by hand;
[doc 06](06-design-tokens.md) explains how.

## The dev menu

Shake the phone, or press <kbd>m</kbd> in the terminal running `npm start`. The
useful entries:

| Item                | Does                                                  |
| ------------------- | ------------------------------------------------------ |
| **Reload**          | Restart the app. First thing to try when it acts odd   |
| **Toggle element inspector** | Tap any element to see its size and position   |
| **Open JS debugger** | Full developer tools, once you need them              |

## Terminal shortcuts

While `npm start` is running:

| Key | Does                                    |
| --- | ---------------------------------------- |
| `r` | Reload the app on all connected devices  |
| `m` | Open the dev menu                        |
| `i` | Open the iOS simulator (Mac only)        |
| `a` | Open the Android emulator                |
| `w` | Open in a web browser                    |
| `?` | Show all shortcuts                       |

## About the web version

`npm run web` opens the app in a browser. Handy for a fast look, and easy to
screenshot. Do not trust it: fonts, scrolling, keyboard behaviour and gestures
all differ from a real device, and some things that work on web are broken on a
phone. Judge the app on a phone.

## Your daily routine

From now on, each session:

```bash
npm start
```

Scan, and work. Once a day or so, and always before trying something risky, save
a checkpoint:

```bash
git add -A
git commit -m "A short note about what changed"
```

That gives you a point to return to. [Doc 08](08-working-with-ai.md) explains
why this matters more when an AI is editing your files.

---

Next: [04 — The stack](04-the-stack.md)
