# 01 — Concepts

The vocabulary, explained through things you already know. Skim it now and come
back when a word trips you up.

## The big picture

Building an app has three layers, and they map onto design work more neatly than
you might expect.

| Layer          | In design terms                                                | Here                                 |
| -------------- | -------------------------------------------------------------- | ------------------------------------ |
| **Framework**  | Figma itself — the environment everything is made inside        | Expo / React Native                  |
| **Components** | Your Figma components, with variants and properties             | Files in `src/components/`           |
| **Tokens**     | Your Figma variables — colour, spacing, type styles             | `src/theme/tokens.js`                |

The correspondence is real, not a metaphor. A Figma component with a Variant
property becomes a code component with a `variant` prop. A Figma colour variable
becomes a token. Setting the project up well is mostly a matter of making that
mapping explicit, which is [doc 06](06-design-tokens.md).

## Words you will keep meeting

**Terminal** (or command line) — a text window where you type commands instead of
clicking. Cursor has one built in: **View → Terminal**. When these docs show a
line in a grey box, you type it there and press Enter. It is a control surface,
like Figma's quick actions bar, just less friendly.

**Node.js** — the program that runs JavaScript on your computer rather than in a
web browser. Your app's build tools are written in JavaScript, so nothing works
without it. You install it once and mostly forget it.

**npm** — Node's package manager, installed alongside Node. It downloads and
tracks the code libraries your project depends on. Think of it as a plugin
manager.

**Package** (or library, or dependency) — code someone else wrote that you use
instead of writing your own. A date formatter, an image picker. Every one is
free work, and also a thing that can break, so add them deliberately.

**`package.json`** — the list of which packages this project uses. Like a
Figma file's list of linked libraries.

**`node_modules/`** — the folder where the actual downloaded package code sits.
It is enormous, it is never edited by hand, and it is deliberately excluded from
version control. If it gets corrupted you delete it and run `npm install` again.

**Repository** (repo) — the project folder, with its full history. This one is
a repo.

**Git** — version history for code. Every save point is a **commit**, and you can
return to any of them. It is Figma's version history, except you choose when to
create a version and you write a note explaining why.

**Branch** — a parallel copy of the project where you can try something without
touching the working version. Like duplicating a page before a redesign. If it
works out you **merge** it back; if not you delete it and lose nothing.

**GitHub** — a website that stores repos online, so they are backed up and
shareable.

**Component** — a reusable piece of interface, defined once and used in many
places. Identical in concept to a Figma component. `Button` in
`src/components/ui/button.tsx` is one.

**Props** — the settings you pass a component when you use it, exactly like the
properties panel on a Figma component instance. `<Button label="Save"
variant="primary" />` sets two props.

**State** — data that changes while the app is running and that the interface
reacts to: what is typed in a field, whether a sheet is open. Figma prototypes
fake this with separate frames; code holds it as a value that, when changed,
redraws the screen automatically.

**TypeScript** — JavaScript with labels describing what kind of value each thing
holds. It catches mistakes like passing a number where text was expected, before
you ever run the app. This is why files end in `.ts` and `.tsx`.

**Bundler** — the tool that packages all your code into something a phone can
run. Ours is called **Metro**. You will see its name in error messages.

**Hot reload** — save a file, and the running app on your phone updates in about
a second, keeping its current state. This is the loop you will live in.

**API** — the way two pieces of software talk. When your app asks a server for a
list of trips, it calls an API.

**Backend** — the server and database part: where accounts and saved data live.
Everything so far is the **frontend**, the part on the phone. [Doc 09](09-backend.md).

**Build** — converting your code into an actual installable app file (`.ipa` for
iOS, `.aab` for Android). Slow, and only needed when you distribute.

## Words specific to this project

**Expo** — a toolkit built on React Native that removes most of the painful parts
of mobile development. Its biggest gift to you: running your app on a real phone
without installing Xcode or Android Studio.

**React Native** — the framework that turns your code into genuinely native iOS
and Android interface elements. Not a website in a wrapper; a real
`UIView` on iOS and a real Android `View`.

**Expo Go** — a free app from the App Store or Play Store that runs your project
on your phone during development.

**Expo Router** — decides which screen is which based on where files sit in
`src/app/`. Create `src/app/about.tsx` and you have an `/about` screen. The
folder structure is the navigation diagram.

**NativeWind / Tailwind** — styling by writing short class names instead of
separate style objects. `className="flex-row items-center gap-3 p-4"` means a
row, vertically centred, 12px between items, 16px padding. Verbose to read at
first, extremely fast once fluent.

**Design token** — a named design decision: `brand`, `content-secondary`,
`radius-card`. Identical to a Figma variable. Defined in `src/theme/tokens.js`.

**MCP (Model Context Protocol)** — the standard that lets Cursor's AI connect to
outside tools. The Figma MCP server is what lets the AI read your actual design
file instead of guessing from a screenshot. [Doc 05](05-figma-to-code.md).

## What the file extensions mean

| Extension | Contains                                                          |
| --------- | ----------------------------------------------------------------- |
| `.tsx`    | A component or screen — TypeScript that also describes interface   |
| `.ts`     | TypeScript with no interface in it: logic, data, helpers           |
| `.js`     | Plain JavaScript, no type labels                                   |
| `.json`   | Structured settings data                                           |
| `.css`    | Styles. In this project only `src/global.css`, which is generated  |
| `.md`     | Markdown — documentation like this file                            |
| `.mdc`    | A Cursor rule: markdown plus a header saying when it applies       |

## Reading a class name

You will see lines like this constantly:

```tsx
<View className="flex-row items-center justify-between gap-3 rounded-card bg-surface p-4">
```

Each word is one design decision:

| Class             | Means                                                 |
| ----------------- | ------------------------------------------------------ |
| `flex-row`        | Lay children out horizontally (auto layout, direction: horizontal) |
| `items-center`    | Centre them on the cross axis                          |
| `justify-between` | Push them to opposite ends, space in the middle        |
| `gap-3`           | 12px between children                                  |
| `rounded-card`    | The `card` corner radius from your tokens              |
| `bg-surface`      | The `surface` background colour from your tokens       |
| `p-4`             | 16px padding on all sides                              |

Numbers are in units of 4px, so `gap-3` is 12px and `p-4` is 16px. Words like
`surface` and `card` are your own tokens.

---

Next: [02 — Install your tools](02-install.md)
