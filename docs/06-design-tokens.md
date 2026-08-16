# 06 — Design tokens

Your Figma variables, living in the code. Get this right and the whole app takes
on your brand at once; skip it and you will be correcting hex codes in forty
files for the rest of the project.

## The idea

One file, `src/theme/tokens.js`, holds every colour, corner radius and font size
the app is allowed to use. Nothing else may contain a hex code or a pixel font
size. It is the same discipline as a Figma variable collection, enforced the same
way: if it is not a variable, it is a mistake.

Here is what happens when you change a value there:

```
   src/theme/tokens.js          ← you edit this
            |
            +---------------------------+
            |                           |
   tailwind.config.js           npm run tokens
   reads it directly                    |
   to define classes            src/global.css
                              (generated — never edit)
            |                           |
            +-------------+-------------+
                          |
              className="bg-brand"  ← used everywhere
```

Two consumers, one source. A colour cannot be right in one place and stale in
another, because there is only one place.

## Try it: rebrand the app in two minutes

Do this now, with the app running on your phone, because seeing it is worth more
than reading about it.

1. Open `src/theme/tokens.js`.
2. Find `brand: '#4F46E5'` under `light` and change it to your brand colour.
3. Change `brand` under `dark` to a lighter version of the same hue — dark
   backgrounds need more luminance to hit the same perceived contrast.
4. In the terminal:

```bash
npm run tokens
```

5. Look at your phone.

The button, the active tab, the badges and the links have all changed. Nothing
else was touched.

## What is in the file

### Colours

Two complete sets, `light` and `dark`, with identical keys. The generator refuses
to run if they differ, which stops the classic bug where a colour is defined for
light mode only and is invisible in dark.

```js
light: {
  background: '#F7F7FA',        // the page behind everything
  surface: '#FFFFFF',           // cards sitting on the page
  'surface-sunken': '#EBEBF0',  // inset areas and pressed states

  content: '#101114',            // primary text
  'content-secondary': '#60646C', // supporting text
  'content-tertiary': '#8C919B',  // captions, disabled
  'content-inverse': '#FFFFFF',   // text on a dark fill

  brand: '#4F46E5',
  'brand-hover': '#4338CA',
  'brand-subtle': '#EEEEFF',      // tinted backgrounds
  'on-brand': '#FFFFFF',          // text on top of brand

  success: '#16915A',
  warning: '#BF8008',
  danger: '#D03038',

  border: '#E2E3E9',
  'border-strong': '#C6C8D2',
}
```

Each token name gives you three classes automatically: `bg-brand`, `text-brand`,
`border-brand`.

The surface levels must stay visibly distinct from each other. If `background`
and `surface` are both white, your cards disappear — which is exactly what
happened during the build of this project, and it is not obvious in a screenshot
until you look for it.

### Radii and type

```js
const radius = { card: 16, control: 12, pill: 999 };

const fontSize = {
  caption:  [12, 16],   // [size, line height]
  footnote: [14, 20],
  body:     [16, 24],
  headline: [20, 28],
  title:    [28, 34],
  display:  [34, 40],
};
```

Named by role rather than by size, so `text-headline` keeps meaning "a card
title" even after you decide card titles should be 22px.

### What is not in the file

**Spacing.** Tailwind's built-in scale already covers it: every step is 4px, so
`p-4` is 16px and `gap-3` is 12px. It matches the 4px or 8px grid you are almost
certainly already using in Figma, so there is nothing to define.

| Class | Pixels | | Class | Pixels |
| ----- | ------ | - | ----- | ------ |
| `p-1` | 4      | | `p-6` | 24     |
| `p-2` | 8      | | `p-8` | 32     |
| `p-3` | 12     | | `p-10`| 40     |
| `p-4` | 16     | | `p-12`| 48     |

The same numbers work for `m-` (margin), `gap-`, `px-`, `py-` and the rest.

## Moving your Figma variables across

With the Figma MCP server connected ([doc 05](05-figma-to-code.md)), ask Cursor:

```
Read the colour variables from this Figma file:
<paste your file link>

Map them onto the tokens in src/theme/tokens.js. For each Figma variable, tell
me which existing token it corresponds to. List any Figma variables with no
equivalent, and any tokens with nothing mapped to them. Do not change any files
yet.
```

You will get a table. Read it as a design review, because that is what it is.
Then:

```
Update src/theme/tokens.js with that mapping, keeping the existing token names
where the meaning matches. Run npm run tokens afterwards.
```

Doing it by hand is completely reasonable too — there are only about sixteen
values.

### If your names do not match

Your variables are probably not called `content-secondary`. You have two options.

**Rename the tokens to match your Figma names.** Best if your naming is already
semantic — `text/muted`, `surface/raised`. Rename the key in `tokens.js`, run
`npm run tokens`, then ask Cursor to update every usage. Keys become class names,
so `text-muted` must be a valid class: lowercase, hyphens, no slashes or spaces.

**Keep these names and map yours onto them.** Best if your Figma variables are
named by appearance — `blue-600`, `grey-100`. Those names will not survive your
next brand change, and inheriting them into code inherits the problem.

Either way, name by role. `danger` still makes sense when the error colour turns
orange; `red` does not.

## Adding a token

Say your design has a "highlight" background for featured content.

1. Add it to **both** modes in `tokens.js`:

```js
light: {
  // ...
  highlight: '#FFF4D6',
},
dark: {
  // ...
  highlight: '#3D2F0C',
},
```

2. Regenerate:

```bash
npm run tokens
```

3. Use it: `bg-highlight`, `text-highlight`, `border-highlight`.

That is the whole process. There is no list to update elsewhere — Tailwind reads
`tokens.js` directly.

## Rules

**Never edit `src/global.css`.** It is generated. The next `npm run tokens`
overwrites it, and your change vanishes with no error.

**Never write a hex value in a component.** If you find yourself wanting to, the
token is missing. Add it.

**Always check both modes.** Switch your phone's appearance after any colour
change. Light-mode-only colours are the most common visual bug in this kind of
project.

**Use classes, not raw values.** `useThemeColors()` exists for the handful of
React Native APIs that cannot accept a class name — navigation bar options,
`<StatusBar>`, some chart libraries. Everywhere else, use the class.

```tsx
// Good
<View className="bg-surface">

// Only when the API leaves no choice
const colors = useThemeColors();
<Tabs screenOptions={{ tabBarActiveTintColor: colors.brand }} />
```

## One trap worth knowing about

Tailwind uses the `text-` prefix for two unrelated things: font size
(`text-body`) and text colour (`text-content`). The utility that merges class
names has to tell them apart, and for custom token names it cannot — so it
assumes both are colours, decides they conflict, and silently discards the font
size. Every heading renders at the default size, with no error anywhere.

This is already fixed in `src/lib/cn.ts`, which is given the list of token names
from `tokens.js` so it knows which `text-` classes are sizes and which are
colours. It is mentioned here for one reason: if you ever restructure the token
system and your type scale mysteriously stops working, that file is why.

## Fonts

The app currently uses the system font — San Francisco on iOS, Roboto on
Android. That is a defensible choice: system fonts are free, load instantly, and
respect the user's accessibility text size settings.

To use a custom font, `expo-font` and `expo-google-fonts` are the tools, and it
is worth doing after the app works rather than before.

---

Next: [07 — Build your first screen](07-build-your-first-screen.md)
