# 08 — Working with AI

You will write very little code by hand. What determines whether you end up with
a real app or an unmaintainable mess is how you direct and review the AI.

## The mental model

Treat the AI as a fast, capable contractor who has never seen your product, has
no memory of yesterday, and will confidently do the wrong thing rather than ask.

That framing predicts almost everything about working with it well. You would not
tell a new contractor "make the settings screen" and walk away. You would show
them the designs, point at the existing components, ask what they planned to do,
and look at the result. Same here.

The thing that catches designers out: the code will *look* fine. It compiles, it
renders, it is neatly formatted. Looking plausible is what these models are best
at. Judging whether it is actually right is your job, and it is a job you are
well equipped for, because most of what goes wrong is visible on screen.

## The four habits that matter

### 1. Ask for a plan before code

The highest-leverage habit in this guide, worth repeating from
[doc 05](05-figma-to-code.md).

```
Before writing any code, tell me your plan: which files you will change,
which existing components you will reuse, and anything you are unsure about.
```

Reviewing a five-line plan takes fifteen seconds. Reviewing four new files takes
fifteen minutes. And when the plan is wrong, correcting it is one sentence rather
than an undo and a retry.

Cursor's Plan mode does this by default and is worth using for anything touching
more than one file.

### 2. Commit constantly

```bash
git add -A
git commit -m "Add settings screen"
```

Every time something works. Not at the end of the day.

This matters more with an AI than without one, because an AI can change eleven
files in four seconds. Without checkpoints, "undo that" means reconstructing from
memory what eleven files used to contain. With them it is:

```bash
git restore .          # discard everything since the last commit
git log --oneline      # see your checkpoints
```

Commits cost nothing. Not having one costs an afternoon.

### 3. Give it the specific file

"Fix the button" makes the AI search and guess. "In
`src/components/ui/button.tsx`, the disabled state is too faint" tells it exactly
where to look. In Cursor, `@`-mention files to attach them to the conversation.

The same applies to designs. A Figma link beats a description of a Figma frame,
every time.

### 4. Actually look at the result

On your phone, not in the diff. Check dark mode. Check a small screen. Tap the
things that should be tappable.

The failure mode is not usually broken code — it is code that works and is
subtly wrong: a card that reinvents `Card` instead of using it, a hard-coded
`#4F46E5` instead of `bg-brand`, a heading that is `text-2xl` instead of your
`display` token. None of that shows up as an error. All of it compounds.

## Prompts that work

**Starting a feature**

```
I want to add a screen where users can see trips they have saved.

Design: <Figma link>

Before writing code, tell me which existing components you will reuse, what
new components are needed, and where the data should come from.
```

**Fixing something visual**

```
On the trip detail screen, the "Start navigation" button sits too close to
the notes card. It should have the same spacing as between the other cards.
```

Describe it in design terms. You do not need to know the class name; that is the
AI's job.

**Understanding code**

```
Explain what src/components/ui/screen.tsx does, line by line, as if I have
never written code.
```

Use this often. It is how you build a mental model of your own project, and it
costs nothing.

**Refactoring**

```
The trip card layout is duplicated in three places. Extract it into a
component in src/components/ and use it everywhere.
```

**Reviewing**

```
Review the changes you just made. Are there places you did not follow the
conventions in .cursor/rules/? Anything hard-coded that should be a token?
```

Asking the AI to check its own work catches a surprising amount.

## Prompts that do not work

| Instead of                       | Say                                                                    |
| -------------------------------- | ----------------------------------------------------------------------- |
| "Make it look better"            | "Increase the spacing between cards to 16px and make titles the headline style" |
| "Add authentication"             | "Add email and password sign-in using Supabase, following docs/09-backend.md" |
| "Fix the bug"                    | "Tapping a trip card on Android does nothing. Here is the error: ..."    |
| "Build the app"                  | One screen at a time                                                     |

The pattern: vague requests get plausible-looking answers that solve a problem
adjacent to yours.

## Reviewing without being able to read code fluently

You can catch most problems by scanning for a few specific things.

**Hard-coded values.** Search the change for `#` followed by letters and
numbers — `#4F46E5`, `#FFF`. Any hex in a component is wrong; it should be a
token. Same for `fontSize: 18` or `padding: 22`.

**Duplicated components.** If the AI created `TripCardNew` or `CustomButton`,
ask why the existing one did not work. Usually the answer is that it did not
look.

**Files you did not expect.** Cursor shows every changed file. If you asked for a
settings screen and `src/app/(tabs)/index.tsx` changed too, ask why before
accepting.

**Missing states.** Every list needs an empty state. Every action that can fail
needs an error state. Every action that takes time needs a loading state.
Generated code routinely handles only the happy path, and this is the single
most common gap.

**Accessibility.** Anything tappable should have `accessibilityRole` and
`accessibilityLabel`.

## Why the rules files matter

`.cursor/rules/` contains this project's conventions, and Cursor loads them
automatically — the always-on one on every request, the others when you touch
matching files. That is why the AI already knows to use `className` rather than
`StyleSheet`, and tokens rather than hex codes, without you saying so.

Add to them whenever you find yourself giving the same correction twice. If you
have said "use the existing Card component" three times, that belongs in
`10-components.mdc`, and you will never say it again.

Keep them short. Rules compete for the model's attention, and a long rules file
is a diluted one.

## When you are stuck

**Read the error.** Errors are unfriendly but usually literal.
`Cannot read property 'name' of undefined` means something you expected to exist
does not. Paste the whole thing into Cursor and ask what it means.

**Restart things, in order.** Reload the app from the dev menu. Then stop
`npm start` and start it again. Then `npx expo start --clear`. This fixes a
genuinely large share of weird behaviour.

**Go back to what worked.** `git restore .` and try a different approach. Fighting
a broken state costs more than redoing twenty minutes of work.

**Start a fresh chat.** Long conversations drift, and the AI starts contradicting
things it said earlier. A new chat with a clear description of the current state
is often instantly better.

**Make it smaller.** If a request keeps failing, it is doing too much. Split it.

## Things to be careful with

**Anything that deletes.** Read commands involving `rm`, `--force` or `reset`
before running them.

**Secrets.** API keys and passwords go in a `.env` file, never in code. `.env`
is already git-ignored.

**Dependencies.** `npx expo install <package>`, not `npm install <package>`. And
be sceptical of new dependencies generally: each one is something that can break
on the next SDK upgrade.

**`npm audit fix --force`.** npm suggests this constantly. It upgrades packages
past versions your project supports and is a reliable way to break a working
build.

---

Next: [09 — Add a backend](09-backend.md)
