# 02 — Install your tools

Four things are required: **Node.js**, **Git**, **Cursor**, and **Expo Go** on
your phone. Everything else is optional and can wait.

Set aside an afternoon. Most of it is download time.

## Before you start: how to use the terminal

Open Cursor and press <kbd>Ctrl</kbd>+<kbd>`</kbd> (the backtick key, above Tab)
to open a terminal panel. Type a command, press Enter, wait for the prompt to
come back.

Two conventions used throughout these docs:

- Type one command at a time and let it finish. Commands that download things
  print a lot of text; that is normal.
- `$` at the start of a line is the prompt, not something you type.

If a command prints `command not found`, the thing it names is not installed.
That is the main error you will see in this doc, and it always means the same
thing.

## 1. Node.js

Node runs your build tools. **Expo SDK 57 requires Node 22.13 or newer.**

### Mac

Install via [nvm](https://github.com/nvm-sh/nvm), which lets you switch Node
versions later without reinstalling — worth the extra minute.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
```

If that version number has aged by the time you read this, take the current one
from [the nvm repository](https://github.com/nvm-sh/nvm#installing-and-updating).

Close the terminal, open a new one, then:

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

If you would rather not use nvm, download the **LTS** installer from
[nodejs.org](https://nodejs.org) and double-click it.

### Windows

Download the **LTS** Windows Installer (`.msi`) from
[nodejs.org](https://nodejs.org) and run it. Accept every default. Restart
Cursor afterwards so it picks up the change.

### Check it worked

```bash
node --version
npm --version
```

You want `v22.13.0` or higher from the first command, and any version from the
second. If either says `command not found`, restart Cursor and try again — a new
install is often only visible to newly opened terminals.

## 2. Git

Git tracks your project's history.

### Mac

```bash
git --version
```

If it is missing, macOS offers to install the developer tools. Accept, wait, and
run the command again.

### Windows

Download from [git-scm.com](https://git-scm.com/download/win) and run the
installer. Accept every default — there are many screens and the defaults are
correct. Restart Cursor.

### Tell Git who you are

Once, on either platform:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

This name goes on every save point you make.

## 3. Cursor

Cursor is a code editor with AI built in. It is where you will spend your time.

1. Download from [cursor.com](https://cursor.com) and install it.
2. Open it and sign in.
3. Open this project: **File → Open Folder**, and select the `rover-app` folder.

Worth doing straight away:

- **Turn on Auto-Save.** File → Auto Save. Expo reloads on save, so this makes
  the app update as you type.
- **Find the AI chat panel.** <kbd>Cmd</kbd>+<kbd>L</kbd> on Mac,
  <kbd>Ctrl</kbd>+<kbd>L</kbd> on Windows.
- **Note the file tree** on the left, and the terminal at the bottom.

Cursor picked up this project's rules automatically when you opened the folder —
they are the files in `.cursor/rules/`, and they are why the AI already knows
this project's conventions. You do not need to do anything to activate them.

## 4. Expo Go on your phone

This is what lets you skip Xcode and Android Studio entirely.

- **iPhone**: install **Expo Go** from the App Store.
- **Android**: install **Expo Go** from the Play Store.

Your phone and your computer must be on the **same Wi-Fi network**. This trips up
more people than anything else in this doc. Corporate and university networks
often block devices from talking to each other; if yours does, a phone hotspot
that your computer joins is the standard workaround.

## 5. Optional: simulators

You do not need these. A real phone is a better test anyway — real size, real
touch, real performance. Install them later if you want to see both platforms
side by side without owning both.

**iOS Simulator (Mac only).** Install Xcode from the Mac App Store. It is very
large, around 10GB, and takes a long time. Then open it once and let it finish
installing components, and run:

```bash
xcode-select --install
```

**Android Emulator (Mac or Windows).** Install
[Android Studio](https://developer.android.com/studio), open it, and follow the
setup wizard. Then use **More Actions → Virtual Device Manager** to create a
device — a recent Pixel is a sensible default.

## You are done when

Every one of these prints a version number:

```bash
node --version    # v22.13.0 or higher
npm --version
git --version
```

Cursor is open with the `rover-app` folder loaded, and Expo Go is on your phone,
on the same Wi-Fi as your computer.

---

Next: [03 — Run the app](03-run-the-app.md)
