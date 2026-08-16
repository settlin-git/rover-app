# 05 — Figma to code

This is the doc that makes your existing design work pay off. By the end, Cursor
can read your actual Figma file — layers, auto layout, variables, components —
rather than guessing from a screenshot.

## What this actually gives you

The Figma MCP server is a connection between Figma and Cursor's AI. Once it is
running, you can paste a link to a frame and ask for it to be built, and the AI
reads the real structure: exact spacing, which variable each colour came from,
what is a component instance versus a one-off, the layer names you chose.

Two things to be clear about up front, because the gap between them is where
people get frustrated.

**What it is very good at.** Reading structure and measurements accurately.
Getting layout, spacing and hierarchy right on the first attempt. Recognising
that eight cards on your canvas are the same component with different content.
Mapping your Figma variables onto the tokens in this project.

**What it is not.** A converter that turns a file into a finished app. It gives
the AI accurate input; the AI still writes ordinary code that you still review.
Think of it as the difference between describing a design over the phone and
handing someone the file. Enormous difference, still not the same as the work
being done.

## Setting it up

This repo already contains `.cursor/mcp.json` pointing at Figma's remote server,
so most of the work is done. You only need to authenticate.

### 1. Connect and authenticate

1. Open this project in Cursor.
2. Open **Cursor Settings** (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> on Mac,
   <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> on Windows).
3. Go to the **MCP** tab. You should see **figma** listed.
4. Click **Connect** next to it. A browser window opens.
5. Sign in to Figma and allow access.
6. Back in Cursor, `figma` should show a green indicator.

Alternatively, Figma publishes a Cursor plugin that bundles the server config
with some ready-made skills. In Cursor's chat, type:

```
/add-plugin figma
```

Either route works. The plugin adds a few extra workflow helpers; the config in
this repo is enough on its own.

### 2. Check it works

In Cursor's chat, with a link to any frame in one of your files:

```
Using the Figma MCP server, describe the layout of this frame:
<paste your Figma link>
```

A correct answer describes your actual layers and spacing. A vague answer that
could apply to any screen means it is not connected — recheck step 1.

### 3. How to get a link

In Figma, right-click a frame or layer on the canvas and choose **Copy link to
selection**. That URL contains a node ID identifying that exact element.

Always link to a **specific frame**, not the whole file. A file link makes the AI
read everything, which is slower, less accurate, and tends to produce code that
blends several screens together.

## Preparing your Figma file

Here is the part with the highest return, and the part only you can do. The
quality of generated code tracks the quality of the file almost exactly. A tidy
file produces components you can ship; a loose one produces code you rewrite.

Work through this before building screens.

### Use auto layout everywhere

Auto layout translates directly into flexbox, which is how React Native lays
things out. Frames with auto layout become clean, responsive components.
Absolutely positioned layers become hard-coded pixel offsets that break on a
different phone size.

If a frame is not in auto layout, the generated code will be worse. This is the
single highest-impact fix in the list.

### Define your variables

Figma variables map onto this project's design tokens one for one. Every colour
that exists as a variable can be matched to a token; every raw hex fill becomes a
hard-coded value the AI has to guess about.

Define variables for colours at minimum, and ideally spacing and corner radii
too. Set up a **Light** and a **Dark** mode if you want dark mode — the app
already supports it and needs both sets of values.

[Doc 06](06-design-tokens.md) covers moving them into the code.

### Name your layers

Layer names are the only signal about intent that survives the export. `Frame
427` tells the AI nothing. `TripCard / Header` tells it this is part of a card
component and which part.

You do not need to name everything. Name components, sections, and anything
repeated.

### Make real components

If your card is a component with variants, the AI will build one code component
with a `variant` prop. If your eight cards are eight independent frames, it may
well build eight independent blocks of code, and you will be maintaining eight
copies of the same card forever.

Figma variants become props. That mapping is exact and it is worth exploiting.

### Design at 393px wide

A sensible modern phone width. Designing at 375 is fine too. What matters is
consistency — mixed frame widths make it unclear which spacing is intentional.

Remember that the width is a reference, not a constraint. Your app must work from
320px up to tablets, so let content stretch rather than pinning it to your
canvas width.

### Delete the mess

Hidden layers, abandoned explorations, and the four versions of the header you
did not pick all get read. Move them to a separate page or delete them.

## The workflow

Once the file is tidy, building a screen looks like this.

### 1. Point at one frame

Copy the link to a single screen frame. Not the flow, not the page — one screen.

### 2. Ask for a plan before code

The most valuable habit in this entire guide. Instead of "build this", ask:

```
Read this Figma frame and plan the implementation. Do not write code yet.
<paste link>

Tell me:
1. Which existing components in src/components/ui/ you will reuse
2. Which new components you need to create, and why the existing ones do not fit
3. Which colours and sizes map to existing tokens in src/theme/tokens.js,
   and which need new tokens added
4. Anything in the design you cannot build with what exists today
```

Read the plan. This is design review, which is work you already know how to do,
and it is much cheaper to correct a plan than to correct built code. If it
proposes a new `Button` when one exists, say so now.

### 3. Then build it

```
That plan looks right, with one change: reuse the existing Card rather than
adding a new container. Go ahead and build it.
```

### 4. Compare against the design

Put the Figma frame and your phone side by side and look for the things you would
catch in any design review: spacing rhythm, type hierarchy, alignment, the states
that are missing.

Then feed corrections back in design language. The AI handles this well:

```
The gap between the header and the first card is too tight — it should
match the gap between cards. The section label should be the caption
style, not footnote.
```

### 5. Check both colour schemes and a small screen

Switch your phone to dark mode. Then check a small device — the iPhone SE size is
the usual thing that breaks, because text that fits on your 393px canvas wraps to
two lines at 320px.

## Prompts worth keeping

**Building a screen from a frame**

```
Build this Figma frame as a new screen at src/app/(tabs)/discover.tsx:
<link>

Follow the conventions in .cursor/rules/. Reuse components from
src/components/ui/ wherever possible, and use existing design tokens rather
than adding new ones unless the design genuinely calls for a new value.
```

**Extracting a component**

```
This Figma component has three variants:
<link>

Create it as src/components/ui/list-row.tsx following the same pattern as
button.tsx — a variants object keyed by variant name, a className prop merged
with cn(), and the variant names matching the Figma ones.
```

**Fixing a mismatch**

```
Compare my implementation in src/app/(tabs)/discover.tsx against this frame
and list every difference in spacing, size and colour:
<link>
```

**Pulling in tokens**

```
Read the colour variables from this Figma file and tell me which ones do not
have a matching token in src/theme/tokens.js. Do not change anything yet.
```

## When it goes wrong

**The output ignores your components and rebuilds everything from scratch.**
Say so explicitly and name the file: "Use the existing Card component from
`src/components/ui/card.tsx` instead of building a new container."

**Colours come out as hex values instead of tokens.** The rule in
`.cursor/rules/20-design-tokens.mdc` covers this, but a design full of raw fills
gives it nothing to match. Fix the variables in Figma, or ask directly: "Replace
every hex colour with the nearest token from `src/theme/tokens.js`."

**Everything is absolutely positioned with fixed widths.** The source frame is
not using auto layout. Fix it in Figma; it is much faster than fixing the code.

**Text overflows or wraps badly on a real phone.** Fixed widths copied from the
canvas. Ask for widths to be removed and content to fill the available space.

## Code Connect, later

Figma's **Code Connect** publishes your real code components back into Figma, so
Dev Mode shows your actual `<Button variant="primary" />` instead of a generic
snippet, and the AI gets an exact mapping between Figma components and code ones.

It is genuinely useful and it is not a beginner task. Come back to it once you
have a component library you are no longer changing weekly — otherwise you will
spend your time maintaining mappings to components that keep moving. When you
do, `@figma/code-connect` and Figma's documentation are the starting points.

---

Next: [06 — Design tokens](06-design-tokens.md)
