# 11 — Troubleshooting

Errors you will actually hit, and what they mean.

## Try this first

Roughly half of all strange behaviour is fixed by one of these, in order:

1. **Reload the app.** Shake the phone, tap Reload.
2. **Restart the dev server.** <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal, then
   `npm start`.
3. **Clear the cache.** `npx expo start --clear`. Fixes most cases where your
   changes seem to have no effect.
4. **Reinstall packages.** Slow but thorough:

```bash
rm -rf node_modules package-lock.json
npm install
```

5. **Check dependency health.** `npm run doctor` tells you if a package version
   is wrong for your SDK.

If none of that works, read on. And whatever the error is, pasting the whole
thing into Cursor and asking what it means genuinely works well — errors are
written for machines but they are usually literal.

## The app will not connect to the dev server

**Symptoms:** the QR code scans but the app hangs on a splash screen, or Expo Go
says "Something went wrong" or "Could not connect to development server".

This is the most common problem in the whole guide, and it is nearly always the
network.

**Check the obvious things.** Phone and computer on the same Wi-Fi — not one on
5GHz and the other on a separate guest network. `npm start` still running.

**If you are on office, university, hotel or guest Wi-Fi,** the network is
probably blocking devices from talking to each other. There is nothing to fix on
your machine; route the connection through Expo's servers instead:

```bash
npx expo start --tunnel
```

Slower, but it works from anywhere. The reliable alternative is a phone hotspot
that your computer joins.

**If it worked yesterday and not today,** your computer's local IP address
changed. Restarting `npm start` re-detects it.

**Also worth checking:** a VPN on either device will break the local connection.
Turn it off. And a firewall prompt you dismissed weeks ago may be blocking Node —
on macOS, System Settings → Network → Firewall.

## Changes do not show up

You save, and nothing happens on the phone.

1. Is Auto Save on in Cursor, and did the file actually save?
2. Press `r` in the terminal to force a reload.
3. If you edited `src/theme/tokens.js`, you must run `npm run tokens`. Token
   changes do not appear until the CSS is regenerated.
4. If you edited `app.json`, `metro.config.js`, `babel.config.js` or
   `tailwind.config.js`, restart the dev server. Configuration is only read at
   startup.
5. `npx expo start --clear`.

## Styling is being ignored

**A class does nothing.** Most likely it does not exist. NativeWind supports a
large subset of Tailwind, not all of it — anything web-only (`hover:`, `cursor-`,
`grid`) has no meaning on a phone. Check
[nativewind.dev](https://www.nativewind.dev) and note that no error is raised for
an unrecognised class; it is silently dropped.

**A colour class does nothing.** Is the token in `src/theme/tokens.js`, and did
you run `npm run tokens`? A class for a token that does not exist is silently
ignored.

**Font sizes stop working.** Every heading renders at the default size. This is
`src/lib/cn.ts` — it needs to know which `text-*` classes are sizes rather than
colours, and it learns that from `tokens.js`. If you restructured the token
system, check that file. [Doc 06](06-design-tokens.md) explains the mechanism.

**Nothing you do to `global.css` has any effect.** It is generated from
`tokens.js`. Edit the tokens instead.

## Layout looks wrong

**Everything is stacked vertically.** React Native defaults to a column, unlike
the web's default row. Add `flex-row`.

**An element will not fill the space.** Add `flex-1` to it, and make sure its
parent has a height — commonly a missing `flex-1` further up the tree.

**Content is under the notch or the home indicator.** The screen is not wrapped
in `<Screen>`, which applies safe-area insets.

**Text is cut off instead of wrapping.** A fixed width somewhere, usually copied
from a Figma frame. Remove it and let the content flow.

**It is fine on your phone and broken on a smaller one.** Values hard-coded from
your design canvas. Test at 320px width — the iPhone SE size is where this always
surfaces.

## TypeScript errors

Red squiggles in Cursor, or output from `npm run typecheck`.

**`Cannot find module '@/components/ui/button'`** — check the spelling and that
the file exists. `@/` means `src/`, so that path is `src/components/ui/button.tsx`.

**`Property 'x' does not exist on type 'y'`** — you are using a prop the
component does not have. Open the component and look at its `Props` type, which
is the list of what it accepts.

**`Type 'string | undefined' is not assignable to type 'string'`** — the value
might be missing and you are treating it as though it cannot be. Handle the
missing case. This is TypeScript catching a real crash before it happens, so
resist the urge to silence it.

**`Cannot find module or type declarations for side-effect import of '@/global.css'`**
— `types/expo.d.ts` is missing or was deleted. That file is what tells
TypeScript that importing CSS is legal.

## Runtime crashes

**`Cannot read property 'x' of undefined`** — you are reading a property of
something that does not exist. Usually data that has not loaded yet, or a lookup
that found nothing. Check the value exists before using it:

```tsx
if (!trip) return <Text>Not found</Text>;
```

**`Text strings must be rendered within a <Text> component`** — bare text sitting
directly inside a `<View>`. Every piece of text needs wrapping. This one catches
everybody at least once.

**`Objects are not valid as a React child`** — you are rendering a whole object
where a string was expected. You probably want a property of it: `trip.title`
rather than `trip`.

**Blank white screen with no error** — usually a crash during the first render.
Open the dev menu, check the logs, and look at whatever you changed last.

## Package and install problems

**`npm install` reports vulnerabilities.** Ignore it. npm reports theoretical
issues in build tools that never run on a user's phone. Do **not** run
`npm audit fix --force` — it upgrades packages past versions your project
supports and is a reliable way to break a working build.

**A package does not work after installing.** Did you use `npx expo install`
rather than `npm install`? Only the Expo command picks versions matching your
SDK. Fix it with:

```bash
npx expo install --check
```

**A package needs native code.** If it says something about linking or native
modules, it cannot run inside Expo Go and needs a development build.
[Doc 10](10-ship.md).

**`command not found: npm` / `node`** — Node is not installed, or the terminal
predates the install. Restart Cursor. [Doc 02](02-install.md).

## Weirder things

**`failed to deserialize; expected an object-like struct named Specifier`** —
two copies of an internal CSS library called `lightningcss` at different
versions. Only relevant if you moved to NativeWind v5. Add to `package.json` and
reinstall:

```json
"overrides": { "lightningcss": "1.30.1" }
```

**`EMFILE: too many open files`** (macOS) — the file watcher hit a limit:

```bash
brew install watchman
```

**Port 8081 is already in use** — an old dev server is still running. Either
accept the offer to use a different port, or find and stop the old one:

```bash
npx kill-port 8081
```

**The web version works and the phone does not.** Trust the phone. Web is a
convenience preview and its behaviour genuinely differs.

## Dark mode problems

**Dark mode does nothing.** Check `"userInterfaceStyle": "automatic"` in
`app.json`.

**Some things adapt and others do not.** The ones that do not are using
hard-coded colours instead of tokens. Search the file for `#`.

**Text is invisible in one mode.** A colour defined for one mode only, or a
foreground and background that happen to match in the other. Check both modes in
`tokens.js`.

## Git problems

**You broke something and want to go back.**

```bash
git restore .                 # discard all uncommitted changes
git log --oneline             # list your checkpoints
git restore --source=<hash> . # go back to a specific one
```

**You have no commit to go back to.** The lesson, unfortunately learned this
way. Commit often — see [doc 08](08-working-with-ai.md).

## Asking for help well

When you paste an error into Cursor, include the whole message rather than the
first line, say what you were doing when it happened, and mention whether it
ever worked. Those three things turn a guess into a diagnosis.

If the answer is not helping after two or three attempts, start a fresh chat and
describe the current state from scratch. Long conversations drift, and the AI
starts defending its earlier answers instead of reconsidering them.

---

Back to [00 — Start here](00-start-here.md)
