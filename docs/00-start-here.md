# 00 — Start here

You are a product designer with Figma files and an idea for an app. This guide
takes you from that to an app running on your phone, and eventually in the app
stores. It assumes you have never written code and explains everything.

## Read this part first

Three things will save you a lot of frustration.

**The AI writes the code; your job is to direct and judge it.** You do not need
to memorise syntax. You do need to be able to read a screen and say "the spacing
is wrong" or "this should reuse the card component" — which, as a designer, you
already can. The bottleneck is not typing speed, it is knowing what good looks
like and describing it precisely. That is a design skill.

**Set up properly before you build anything.** It is tempting to skip to
generating screens. Don't. Docs 02 through 06 exist because an AI given your
real design tokens and a real component library produces work you can ship,
while the same AI given a blank project produces a pile of hard-coded colours
that has to be rewritten. The setup is what makes everything after it fast.

**Things will break, and that is normal.** Every developer's day contains errors.
The difference between someone who ships and someone who gives up is that the
first person expects errors and reads them. [Doc 11](11-troubleshooting.md)
covers the ones you are most likely to hit. Paste any error into Cursor and ask
what it means — that works remarkably well.

## The plan

Each stage builds on the one before it. Do them in order.

### Stage 1 — Get set up

| Step | Doc                                   | You will end up with                                          |
| ---- | ------------------------------------- | ------------------------------------------------------------- |
| 1    | [01 — Concepts](01-concepts.md)       | Knowing what a repo, package and terminal are                 |
| 2    | [02 — Install your tools](02-install.md) | Node, Git, Cursor and Expo Go installed                    |
| 3    | [03 — Run the app](03-run-the-app.md) | This app running on your actual phone                         |

Stop here until the app is on your phone and you can change some text and watch
it update. Everything else depends on that loop working.

### Stage 2 — Make it yours

| Step | Doc                                     | You will end up with                                     |
| ---- | --------------------------------------- | -------------------------------------------------------- |
| 4    | [04 — The stack](04-the-stack.md)       | Understanding what each piece does                       |
| 5    | [05 — Figma to code](05-figma-to-code.md) | Cursor reading your real Figma file                    |
| 6    | [06 — Design tokens](06-design-tokens.md) | Your colours and type scale driving the whole app      |

After stage 2 the app still has example screens, but they are in *your* brand.
This is the highest-leverage work in the whole guide.

### Stage 3 — Build

| Step | Doc                                                    | You will end up with              |
| ---- | ------------------------------------------------------ | --------------------------------- |
| 7    | [07 — Build your first screen](07-build-your-first-screen.md) | A real screen from your design |
| 8    | [08 — Working with AI](08-working-with-ai.md)          | Habits that keep the app coherent |

Then repeat step 7 for each screen. Most of your time lives here.

### Stage 4 — Make it real

| Step | Doc                              | You will end up with                     |
| ---- | -------------------------------- | ---------------------------------------- |
| 9    | [09 — Add a backend](09-backend.md) | Accounts and data that persist         |
| 10   | [10 — Ship it](10-ship.md)       | The app on testers' phones, then a store |

## How long this takes

Honest estimates, assuming you are starting cold.

| Stage                                  | Effort                                                    |
| -------------------------------------- | --------------------------------------------------------- |
| Installing tools (doc 02)              | An afternoon. Mostly waiting on downloads.                 |
| First run on your phone (doc 03)       | Minutes, if the installs went cleanly.                     |
| Figma connection and tokens (05, 06)   | A focused day, and the best day you will spend.            |
| Each new screen (doc 07)               | An hour or two at first, dropping sharply with practice.   |
| A backend (doc 09)                     | Several sessions. This is where genuinely new concepts arrive. |
| First TestFlight build (doc 10)        | A day, most of it Apple's paperwork rather than your code. |

The pattern that surprises people: the first screen is slow and the tenth is
fast, because by then the components exist and the AI has examples to copy. Push
through the early slowness.

## What this will cost

| Thing                          | Cost                        | When you need it              |
| ------------------------------ | --------------------------- | ----------------------------- |
| Node, Git, Expo Go, the app    | Free                        | Now                           |
| Cursor                         | Free tier; paid for heavy use | Now                         |
| Figma MCP server               | Included with Figma         | Doc 05                        |
| Supabase (backend)             | Free to start               | Doc 09                        |
| Expo EAS builds                | Free tier: 15 iOS + 15 Android builds/month | Doc 10        |
| Apple Developer Program        | $99/year                    | Only to reach real iPhones    |
| Google Play Console            | $25 once                    | Only to publish on Android    |

You can go all the way to a working app on your own phone without spending
anything. The fees start when you want other people to install it.

## A note on scope

The fastest way to fail is to build every feature you have designed. Pick the
single screen that shows what the app is for, and build only that, end to end.
An app with one finished screen teaches you more than ten half-built ones, and
you will make better decisions on the remaining screens for having finished one.

---

Next: [01 — Concepts](01-concepts.md)
