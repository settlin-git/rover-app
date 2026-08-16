# 10 — Ship it

Getting the app off your machine and onto other people's phones.

Everything so far has run inside Expo Go. Shipping means producing a real,
standalone app — and that is where Apple and Google's rules, fees and review
queues enter the picture. Budget more patience than code here; most of the work
is paperwork.

## The three stages

| Stage                | Who can install it     | What it costs                    |
| -------------------- | ---------------------- | -------------------------------- |
| **Development build** | You, on your own devices | Free                            |
| **Internal testing**  | People you invite      | Apple $99/year for iOS testers   |
| **Public release**    | Anyone                 | Apple $99/year, Google $25 once  |

Do them in that order. Do not go near the App Store until people you know have
used the app on their own phones and told you what is wrong with it.

## What EAS is

EAS (Expo Application Services) builds your app in the cloud. This matters
because building for iOS normally requires a Mac with Xcode; EAS runs the build
on Apple hardware for you, so you can ship an iPhone app from Windows.

The free tier includes 15 iOS and 15 Android builds per month, which is
plenty while you are learning. Builds take roughly ten to twenty minutes.

## Set up EAS

```bash
npm install -g eas-cli
eas login
```

Create a free account at [expo.dev](https://expo.dev) if you do not have one.
Then, in the project:

```bash
eas init
eas build:configure
```

That creates `eas.json`, which defines your build profiles, and links the
project to your Expo account. Commit both changes.

## Development builds

A development build is your app, compiled properly, with the dev tools still
attached. You need one as soon as you add a library containing native code that
Expo Go does not bundle — and you will, eventually.

```bash
eas build --profile development --platform ios
```

For iOS this requires the $99/year Apple Developer Program, because Apple will
not let unsigned apps onto a physical device. On Android it is free:

```bash
eas build --profile development --platform android
```

You get a link, download it to the device, and from then on `npm start` connects
to that app instead of Expo Go.

If you are not yet paying Apple, stay in Expo Go on iOS and use Android
development builds when you need native code.

## Before you build for real

A checklist that saves a rejected submission or an embarrassing screenshot.

**App identity.** In `app.json`, set `name` to the name users will see, and set a
proper bundle identifier — reverse-domain style, e.g. `com.yourname.rover`. It
can never be changed after your first submission, so choose carefully.

```json
{
  "expo": {
    "name": "Rover",
    "slug": "rover-app",
    "ios": { "bundleIdentifier": "com.yourname.rover" },
    "android": { "package": "com.yourname.rover" }
  }
}
```

**Icon and splash screen.** Replace the placeholders in `assets/images/`. The
icon must be a 1024x1024 PNG with no transparency and no rounded corners — the
platforms round it themselves. This is a job you will enjoy more than most of
this doc.

**Version numbers.** `version` is what users see (`1.0.0`). The build number
underneath must increase with every submission; EAS can manage that with
`"autoIncrement": true` in `eas.json`.

**Permissions.** Every permission you request needs a sentence explaining why,
shown in the system prompt. Apple rejects vague ones. "Rover uses your location
to record the route you travel" passes; "for app functionality" does not.

**Check the real thing.** Every screen, in both light and dark mode, on the
smallest phone you can find. Then turn off Wi-Fi and open the app — if it hangs
forever with no message, fix that before shipping.

## Internal testing

The stage most people skip and then regret.

**iOS — TestFlight**

```bash
eas build --profile preview --platform ios
eas submit --platform ios
```

Then in App Store Connect, add testers by email. Up to 100 internal testers, no
review required, and they install through the TestFlight app. This is the
fastest way to get your app onto someone else's iPhone.

**Android — internal testing track**

```bash
eas build --profile preview --platform android
eas submit --platform android
```

In the Play Console, create an internal testing release and add testers by email.
Available within minutes.

Watch someone use it without helping them. You will learn more in ten minutes
than in a week of reading your own code.

## Public release

**Apple.** Expect the slowest part to be paperwork rather than technology.
Enrol in the Apple Developer Program ($99/year; individual enrolment is quicker,
company enrolment needs a D-U-N-S number and takes longer). Then create the app
in App Store Connect, and prepare screenshots at the exact sizes Apple demands,
a description, keywords, a support URL, and a privacy policy — which is
mandatory, even for a simple app. Review typically takes a day or two, and
first-time rejections are routine. Read the reason, fix it, resubmit.

**Google.** $25 once, no renewal. Individual developer accounts now require
identity verification, and new accounts need a period of closed testing with a
minimum number of testers before you can go public — so start that early rather
than discovering it at launch. Review is usually faster than Apple's.

Both stores need: an icon, screenshots on real device frames, a short and long
description, a privacy policy URL, and a content rating questionnaire. As a
designer you will do the store listing better than most developers; it is the
first impression and it is worth real effort.

## Updates after launch

Here is the part that makes Expo genuinely pleasant. Most changes do not need a
new build or a review.

```bash
eas update --branch production --message "Fix spacing on trip detail"
```

Users get the change next time they open the app. Copy fixes, styling, layout,
and most logic changes ship this way — minutes instead of days.

What still requires a full build and review: new native libraries, permission
changes, app icon or name changes, and SDK upgrades. The rule of thumb is that
if it only touches JavaScript, you can push an update.

Do not abuse it. Shipping unreviewed changes that substantially alter what the
app does violates both stores' rules.

## After launch

**Watch for crashes.** Expo's dashboard shows errors from real devices. Look at
it weekly.

**Keep Expo current.** A new SDK arrives every few months. Upgrading promptly is
much easier than skipping three and doing them at once:

```bash
npx expo install expo@latest --fix
npm run doctor
```

Then build, test properly, and ship. Never push an SDK upgrade straight to
production.

**Keep committing.** Same habit, higher stakes.

---

Next: [11 — Troubleshooting](11-troubleshooting.md)
