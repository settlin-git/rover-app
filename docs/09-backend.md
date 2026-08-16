# 09 — Add a backend

Right now the app's data lives in `src/data/trips.ts` as three hard-coded trips.
It looks real, it demos well, and it forgets everything when the app closes.

A backend gives you accounts, data that persists, and data shared between
devices and users. This is the point where genuinely new concepts arrive, so
work through it slowly.

## Do you need one yet?

Not necessarily. Two cheaper options are worth ruling out first.

**If data only needs to survive app restarts on one phone** — a saved theme,
onboarding progress, a local list — use device storage instead. `expo-sqlite`
gives you a `localStorage` that works exactly like the web one. No accounts, no
server, no cost.

**If the data never changes** — help text, a fixed catalogue — leave it in the
code. It ships with the app and always works offline.

Reach for a backend when you need accounts, or when two people need to see the
same data. Everything below assumes you do.

## Which backend

| Option        | Verdict                                                                       |
| ------------- | ------------------------------------------------------------------------------- |
| **Supabase**  | **Recommended.** Real Postgres, auth, file storage, generous free tier, excellent docs. Your data is in a standard database you could take elsewhere. |
| Firebase      | Also good, and more mature. But its database is a non-relational one that models relationships awkwardly, and leaving Google's ecosystem later is painful. |
| Convex        | Elegant, with live-updating queries by default. Smaller community, so fewer examples and weaker AI support. |
| Your own server | Only if you already know how. It is a second thing to build, host, secure and keep running. |

Supabase for the rest of this doc. It is Postgres — the most widely understood
database there is — which also means the AI knows it extremely well.

## 1. Create a project

1. Sign up at [supabase.com](https://supabase.com).
2. Create a new project. Pick a region near your users; it affects speed.
3. Save the database password it generates. You will not be shown it again.
4. Wait a minute or two while it provisions.

Then, in your project, open **Connect** (or **Project Settings → API**) and copy:

- the **Project URL**
- the **publishable** key (sometimes shown as the *anon* key)

The publishable key is safe to ship inside your app. That is what it is for. It
grants no access on its own — the database's own rules decide what it can reach,
which is step 5 and the most important step here.

## 2. Install the client

```bash
npx expo install @supabase/supabase-js expo-sqlite
```

`expo-sqlite` is where the signed-in session gets stored on the device, so users
stay logged in between launches. The install command adds it to your `app.json`
plugins automatically.

## 3. Store your keys

Create a file called `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The `EXPO_PUBLIC_` prefix is required — it is how Expo knows a variable is meant
to reach the app. Anything without it stays on your machine.

`.env` is already git-ignored, so your keys never reach GitHub. Restart
`npm start` after creating it; environment variables are read at startup.

## 4. Create the client

`src/lib/supabase.ts`:

```ts
import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

`detectSessionInUrl: false` because phones have no browser URL to read a session
out of. The import on the first line must stay first — it installs the storage
that the line below depends on.

You may find older tutorials adding `react-native-url-polyfill`. Expo projects
do not need it; Expo already provides a `URL` global.

## 5. Create a table

In Supabase, open the **SQL Editor** and run:

```sql
create table trips (
  id text primary key,
  user_id uuid references auth.users not null default auth.uid(),
  title text not null,
  location text not null,
  starts_on date not null,
  distance_km integer not null default 0,
  status text not null default 'planned',
  notes text,
  created_at timestamptz not null default now()
);

alter table trips enable row level security;

create policy "Users manage their own trips"
  on trips for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Read the last part carefully — it is the security of your entire app.**

Row Level Security means the database itself refuses to return rows a user does
not own. Not your app code, which anyone can bypass by calling the API
directly: the database. The policy says a user can only see and change rows
where `user_id` matches who they are signed in as.

Without those last five lines, anyone with your publishable key — which ships
inside your app and is trivially extractable — can read and delete every user's
data. This is the single most common serious mistake in Supabase apps.

Enable RLS on every table, immediately, before you put real data in it.

## 6. Replace the fake data

The current `src/data/trips.ts` returns an array instantly. The new one has to
go to the network, which takes time and can fail — so the functions become
`async` and return promises.

There is one wrinkle worth understanding. Postgres columns are conventionally
`snake_case` (`starts_on`), while JavaScript is `camelCase` (`startsOn`). Rather
than let database naming leak into every screen, convert once at the boundary:

```ts
import { supabase } from '@/lib/supabase';

export type TripStatus = 'planned' | 'active' | 'complete';

export type Trip = {
  id: string;
  title: string;
  location: string;
  startsOn: string;
  distanceKm: number;
  status: TripStatus;
  notes: string;
};

/** The shape Postgres returns: snake_case column names. */
type TripRow = {
  id: string;
  title: string;
  location: string;
  starts_on: string;
  distance_km: number;
  status: TripStatus;
  notes: string | null;
};

function toTrip(row: TripRow): Trip {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    startsOn: row.starts_on,
    distanceKm: row.distance_km,
    status: row.status,
    notes: row.notes ?? '',
  };
}

export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('starts_on', { ascending: true });

  if (error) throw error;
  return (data as TripRow[]).map(toTrip);
}

export async function getTrip(id: string): Promise<Trip | null> {
  const { data, error } = await supabase.from('trips').select('*').eq('id', id).maybeSingle();

  if (error) throw error;
  return data ? toTrip(data as TripRow) : null;
}
```

Notice there is no `where user_id = ...` anywhere. You do not need one — the
security policy applies it for you, and it cannot be forgotten or bypassed.

## 7. Handle the three states

This is the part that actually changes your screens, and it is the real cost of
adding a backend. Fake data has one state: here it is. Real data has three:
still loading, failed, or arrived — and "arrived but empty" is a fourth worth
designing for.

A small hook keeps that bookkeeping out of every screen. Create
`src/hooks/use-async.ts`:

```ts
import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => void;
};

/**
 * Runs an async function and tracks its three possible outcomes, so screens can
 * render loading, error and success states without repeating this bookkeeping.
 *
 * `run` must be stable between renders. A function defined at module level
 * already is; anything that closes over a value needs useCallback:
 *
 *     const load = useCallback(() => getTrip(id), [id]);
 *     const { data, loading, error } = useAsync(load);
 */
export function useAsync<T>(run: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<Omit<AsyncState<T>, 'reload'>>({
    data: null,
    error: null,
    loading: true,
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    run()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, error, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [run, nonce]);

  const reload = useCallback(() => {
    setState((previous) => ({ ...previous, loading: true }));
    setNonce((n) => n + 1);
  }, []);

  return { ...state, reload };
}
```

The `cancelled` flag matters more than it looks: if someone opens a trip and
immediately goes back, the response arrives for a screen that no longer exists.
Without the flag you get a warning and, in some cases, a crash.

Now the trips screen handles all four cases:

```tsx
export default function TripsScreen() {
  const { data: trips, error, loading, reload } = useAsync(getTrips);

  return (
    <Screen>
      <View className="gap-1">
        <Text variant="caption">Rover</Text>
        <Text variant="display">Your trips</Text>
        {trips ? <Text variant="footnote">{trips.length} routes saved</Text> : null}
      </View>

      {loading ? <ActivityIndicator className="mt-8" /> : null}

      {error ? (
        <Card variant="outlined" className="gap-3">
          <Text variant="headline">Could not load your trips</Text>
          <Text variant="footnote">{error.message}</Text>
          <Button label="Try again" variant="secondary" onPress={reload} />
        </Card>
      ) : null}

      {trips && trips.length === 0 ? (
        <Card variant="outlined" className="items-center gap-2 py-8">
          <Text variant="headline">No trips yet</Text>
          <Text variant="footnote">Plan your first route to see it here.</Text>
        </Card>
      ) : null}

      {trips && trips.length > 0 ? (
        <View className="gap-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </View>
      ) : null}

      <Button label="Plan a new trip" onPress={() => {}} />
    </Screen>
  );
}
```

Design these states properly. An empty state is the first thing every new user
sees, and a good one explains what to do next rather than showing a blank
screen. Loading and error states are where apps feel cheap, and they are almost
never in the Figma file — which makes them yours to specify.

Once you have several screens doing this, **TanStack Query** replaces the hook
and adds caching, background refetching and retries. Worth adopting then; not
worth the extra concept now.

## 8. Add sign-in

Create `src/lib/auth.tsx`:

```tsx
import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type AuthState = { session: Session | null; loading: boolean };

const AuthContext = createContext<AuthState>({ session: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```

Wrap the app in `<AuthProvider>` inside `src/app/_layout.tsx`, and any screen can
then call `useAuth()` to find out who is signed in.

Signing in and up:

```ts
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signUp({ email, password });
await supabase.auth.signOut();
```

One thing that confuses everybody the first time: new Supabase projects require
email confirmation, so `signUp` succeeds but returns a `null` session until the
user clicks the link in their email. During development, turn **Confirm email**
off in **Authentication → Providers → Email**. Turn it back on before launch.

This is a reasonable point to hand over to the AI:

```
Add sign-in and sign-up screens using the AuthProvider in src/lib/auth.tsx.
Follow the conventions in .cursor/rules/ and use the existing components in
src/components/ui/. Redirect to the tabs when signed in, and to sign-in when
not. Handle loading and error states on both screens.
```

## Rules to hold onto

**Enable RLS on every table.** Repeated because it is the one mistake with real
consequences.

**Never put the service role key in the app.** Supabase also issues a secret key
that bypasses all security rules. It belongs on a server, never in an app.
If you see `service_role` anywhere in `src/`, remove it.

**Keep `.env` out of Git.** It already is. Do not change that.

**Test with two accounts.** Sign up as two different users and confirm neither
can see the other's data. If they can, your policy is wrong.

**Assume the network fails.** Phones lose signal in lifts and tunnels. Every
screen that loads data needs an error state that offers a way to retry.

---

Next: [10 — Ship it](10-ship.md)
