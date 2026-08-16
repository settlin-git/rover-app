/**
 * Expo normally writes an `expo-env.d.ts` file for you, but only once the dev
 * server has run, and that file is git-ignored. Referencing the same types
 * here — in a file that is committed — means `npm run typecheck` works on a
 * freshly cloned repo, before anyone has started the app.
 *
 * This is what teaches TypeScript that importing `global.css` is legal.
 */
/// <reference types="expo/types" />
