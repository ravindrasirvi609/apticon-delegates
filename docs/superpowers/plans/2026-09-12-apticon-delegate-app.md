# APTICON Delegate App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the bare Expo scaffold in `apticon-delegates` into a complete, professional, read-only delegate companion app for APTICON 2026, with 5 tabs (Home, Schedule, Committee, Speakers, Venue), visually consistent with `apticon.in`, using static data ported from `C:\Users\C839248\apticon-2026`.

**Architecture:** Expo Router (file-based routing) under `src/app`, a 5-tab `Tabs` navigator, static TypeScript data modules under `src/data`, a small shared theme (`src/theme`) and UI kit (`src/components/ui`) ported from the website's brand palette/typography, and two pure logic modules (countdown, committee search) with unit tests.

**Tech Stack:** Expo SDK 57, Expo Router, React Native 0.86, TypeScript, `@expo-google-fonts/playfair-display` + `@expo-google-fonts/inter`, `expo-linear-gradient`, `lucide-react-native`, `jest-expo` for unit tests. No backend, no auth, no forms, no data fetching.

**Spec:** `docs/superpowers/specs/2026-09-12-apticon-delegate-app-design.md`

## Global Constraints

- No backend, no login, no forms, no write/interactive flows (per spec "Non-goals").
- All content is static data bundled at build time — no network fetching of content.
- Before writing any Expo Router / font / image API code, the current versioned docs
  (`https://docs.expo.dev/versions/v57.0.0/`) take precedence over any older pattern —
  per this repo's `AGENTS.md`. This plan's package-install steps always use
  `npx expo install <pkg>` (never hand-pinned versions) so the correct SDK-57-compatible
  version is resolved automatically.
- Brand palette and fonts are ported verbatim from `apticon-2026/app/globals.css`:
  primary `#1E1B4B/#312E81/#4338CA/#4F46E5`, accent `#EA580C/#F97316/#FB923C/#FDBA74`,
  secondary `#0F172A/#1E293B/#334155`, surface `#F8FAFC/#F1F5F9/#E2E8F0`,
  text `#0F172A` (dark) / `#475569` (muted). Display font = Playfair Display,
  body/UI font = Inter.
- File/folder layout follows the current Expo "new project" convention: `src/app`
  (routes only), `src/components`, `src/screens`, `src/theme.ts`-equivalent folder,
  `src/data`, `src/hooks`, `src/utils`, with `@/*` aliased to `./src/*`.
- Route/file names use kebab-case (Expo Router convention).
- Every task ends with `npx tsc --noEmit` passing with zero errors before commit.

---

### Task 1: Bootstrap Expo Router

Replace the default `App.tsx`/`index.ts` entry with a minimal Expo Router setup and prove it boots, before any theme/content work begins.

**Files:**
- Modify: `package.json` (`main` field, new dependencies)
- Modify: `app.json` (`scheme`, `plugins`, `experiments.typedRoutes`)
- Modify: `tsconfig.json` (path alias)
- Create: `src/app/_layout.tsx`
- Create: `src/app/index.tsx`
- Delete: `App.tsx`
- Delete: `index.ts`

**Interfaces:**
- Produces: the `@/*` → `./src/*` path alias every later task's imports rely on.
- Produces: `src/app/_layout.tsx` default-exporting a `Stack` — Task 2 extends this file (font loading), Task 8 nests the tabs layout under it.

- [ ] **Step 1: Install Expo Router and its required peers**

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants
```

- [ ] **Step 2: Point the app entry at Expo Router**

In `package.json`, change:

```json
"main": "index.ts"
```

to:

```json
"main": "expo-router/entry"
```

- [ ] **Step 3: Configure `app.json` for Expo Router**

Add to the `"expo"` object in `app.json` (keep all existing keys):

```json
"scheme": "apticon",
"plugins": ["expo-router"],
"experiments": {
  "typedRoutes": true
}
```

- [ ] **Step 4: Add the `@/*` path alias**

Replace the contents of `tsconfig.json` with:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 5: Create the root layout**

Create `src/app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 6: Create a minimal placeholder route**

Create `src/app/index.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Placeholder() {
  return (
    <View style={styles.container}>
      <Text>APTICON 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

- [ ] **Step 7: Delete the old entry files**

```bash
rm App.tsx index.ts
```

- [ ] **Step 8: Verify it compiles and boots**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: `tsc` reports no errors. The web bundle builds and the browser shows
a blank screen with the text "APTICON 2026" — no red error overlay.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: bootstrap Expo Router entry point"
```

---

### Task 2: Theme tokens and font loading

**Files:**
- Create: `src/theme/colors.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/index.ts`
- Modify: `src/app/_layout.tsx`

**Interfaces:**
- Consumes: nothing (leaf module).
- Produces: `colors`, `fontFamily`, `spacing`, `radius` — every UI component task
  (Task 4 onward) imports these from `@/theme`.
- Produces: fonts loaded and splash held in `src/app/_layout.tsx` — every screen
  task can assume `Inter_*` / `PlayfairDisplay_*` families are registered by the
  time any route renders.

- [ ] **Step 1: Install font and splash-screen packages**

```bash
npx expo install expo-font expo-splash-screen @expo-google-fonts/inter @expo-google-fonts/playfair-display
```

- [ ] **Step 2: Write the color tokens**

Create `src/theme/colors.ts`:

```ts
export const colors = {
  primary: { 900: '#1E1B4B', 800: '#312E81', 700: '#4338CA', 600: '#4F46E5' },
  accent: { 500: '#EA580C', 400: '#F97316', 300: '#FB923C', 200: '#FDBA74' },
  secondary: { 900: '#0F172A', 800: '#1E293B', 700: '#334155' },
  surface: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0' },
  text: { dark: '#0F172A', muted: '#475569', light: '#F8FAFC' },
  white: '#FFFFFF',
} as const;
```

- [ ] **Step 3: Write the typography tokens**

Create `src/theme/typography.ts`. These exact export names were verified against
the installed `@expo-google-fonts/inter` and `@expo-google-fonts/playfair-display`
packages (no optical-size variants on this version of Inter):

```ts
export const fontFamily = {
  display: 'PlayfairDisplay_700Bold',
  displayBlack: 'PlayfairDisplay_900Black',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
} as const;
```

- [ ] **Step 4: Write spacing/radius tokens**

Create `src/theme/spacing.ts`:

```ts
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 } as const;
```

- [ ] **Step 5: Create the barrel export**

Create `src/theme/index.ts`:

```ts
export { colors } from './colors';
export { fontFamily, fontSize } from './typography';
export { spacing, radius } from './spacing';
```

- [ ] **Step 6: Load fonts in the root layout with a splash hold**

Replace `src/app/_layout.tsx`:

```tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from '@expo-google-fonts/playfair-display';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: no `tsc` errors; web app still shows the placeholder screen (splash
resolves immediately once fonts load).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add theme tokens and load brand fonts"
```

---

### Task 3: Pure logic utilities — countdown and committee search (with unit tests)

These are the only two pieces of non-trivial logic in the app; everything else
is static content rendering. Both get real unit tests.

**Files:**
- Create: `src/utils/countdown.ts`
- Create: `src/utils/countdown.test.ts`
- Create: `src/utils/committee-search.ts`
- Create: `src/utils/committee-search.test.ts`
- Create: `src/hooks/use-countdown.ts`
- Create: `jest.config.js`
- Modify: `package.json` (devDependencies, `scripts.test`)

**Interfaces:**
- Produces: `getCountdownParts(target: Date, now?: Date): CountdownParts` and
  `useCountdown(target: Date): CountdownParts` — consumed by the Home screen
  (Task 9).
- Produces: `memberMatches(member: CommitteeMember, query: string): boolean`
  and `filterStateBranches(branches: StateBranch[], query: string): StateBranch[]`
  — consumed by the Committee screen (Task 12). `CommitteeMember`/`StateBranch`
  types are declared here as lightweight local interfaces and re-exported by
  `src/data/committee.ts` in Task 7 so both modules share one shape (no
  duplicate/divergent type definitions).

- [ ] **Step 1: Install the test runner**

```bash
npm install --save-dev jest jest-expo @types/jest
```

- [ ] **Step 2: Configure Jest**

Create `jest.config.js`:

```js
module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
```

Add to `package.json` `"scripts"`:

```json
"test": "jest"
```

- [ ] **Step 3: Write the failing countdown test**

Create `src/utils/countdown.test.ts`:

```ts
import { getCountdownParts } from './countdown';

describe('getCountdownParts', () => {
  it('splits a future difference into days/hours/minutes/seconds', () => {
    const now = new Date('2026-10-22T00:00:00+05:30');
    const target = new Date('2026-10-24T09:00:00+05:30');
    const result = getCountdownParts(target, now);
    expect(result).toEqual({ days: 2, hours: 9, minutes: 0, seconds: 0, isPast: false });
  });

  it('flags a past target as isPast with zeroed parts', () => {
    const now = new Date('2026-11-01T00:00:00+05:30');
    const target = new Date('2026-10-24T09:00:00+05:30');
    const result = getCountdownParts(target, now);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
  });
});
```

- [ ] **Step 4: Run it and confirm it fails**

```bash
npx jest src/utils/countdown.test.ts
```

Expected: FAIL — `Cannot find module './countdown'`.

- [ ] **Step 5: Implement `countdown.ts`**

Create `src/utils/countdown.ts`:

```ts
export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getCountdownParts(target: Date, now: Date = new Date()): CountdownParts {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  };
}
```

- [ ] **Step 6: Run the test and confirm it passes**

```bash
npx jest src/utils/countdown.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 7: Wrap it in a hook**

Create `src/hooks/use-countdown.ts`:

```ts
import { useEffect, useState } from 'react';
import { getCountdownParts, type CountdownParts } from '@/utils/countdown';

export function useCountdown(target: Date): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdownParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getCountdownParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}
```

- [ ] **Step 8: Write the failing committee-search test**

Create `src/utils/committee-search.test.ts`:

```ts
import { memberMatches, filterStateBranches, type StateBranch } from './committee-search';

const branches: StateBranch[] = [
  {
    state: 'Chhattisgarh',
    members: [
      { name: 'Amber Vyas', role: 'President', designation: 'Assistant Professor', institution: 'UIP, Raipur' },
      { name: 'Dr. Ajazuddin', role: 'Vice President', designation: 'Principal', institution: 'Rungta College' },
    ],
  },
  {
    state: 'Kerala',
    members: [
      { name: 'Dr. Mohammed Haneefa K P', role: 'President', designation: 'Principal', institution: 'Moulana College' },
    ],
  },
];

describe('memberMatches', () => {
  it('matches case-insensitively on name', () => {
    expect(memberMatches(branches[0].members[0], 'amber')).toBe(true);
  });

  it('matches on institution', () => {
    expect(memberMatches(branches[0].members[1], 'rungta')).toBe(true);
  });

  it('returns false when nothing matches', () => {
    expect(memberMatches(branches[0].members[0], 'nonexistent')).toBe(false);
  });

  it('treats an empty query as a match', () => {
    expect(memberMatches(branches[0].members[0], '')).toBe(true);
  });
});

describe('filterStateBranches', () => {
  it('keeps a whole branch when the state name matches', () => {
    const result = filterStateBranches(branches, 'chhattisgarh');
    expect(result).toHaveLength(1);
    expect(result[0].members).toHaveLength(2);
  });

  it('keeps only matching members within a branch otherwise', () => {
    const result = filterStateBranches(branches, 'ajazuddin');
    expect(result).toHaveLength(1);
    expect(result[0].state).toBe('Chhattisgarh');
    expect(result[0].members).toHaveLength(1);
  });

  it('drops branches with no matches', () => {
    const result = filterStateBranches(branches, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('returns everything unchanged for an empty query', () => {
    expect(filterStateBranches(branches, '')).toEqual(branches);
  });
});
```

- [ ] **Step 9: Run it and confirm it fails**

```bash
npx jest src/utils/committee-search.test.ts
```

Expected: FAIL — `Cannot find module './committee-search'`.

- [ ] **Step 10: Implement `committee-search.ts`**

Create `src/utils/committee-search.ts`:

```ts
import type { ImageSourcePropType } from 'react-native';

export interface CommitteeMember {
  name: string;
  role?: string;
  designation?: string;
  institution?: string;
  email?: string;
  image?: ImageSourcePropType;
}

export interface StateBranch {
  state: string;
  members: CommitteeMember[];
}

export function memberMatches(member: CommitteeMember, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [member.name, member.role, member.designation, member.institution]
    .filter((field): field is string => Boolean(field))
    .some((field) => field.toLowerCase().includes(q));
}

export function filterStateBranches(branches: StateBranch[], query: string): StateBranch[] {
  const q = query.trim().toLowerCase();
  if (!q) return branches;
  return branches
    .map((branch) => ({
      ...branch,
      members: branch.state.toLowerCase().includes(q)
        ? branch.members
        : branch.members.filter((m) => memberMatches(m, q)),
    }))
    .filter((branch) => branch.members.length > 0);
}
```

- [ ] **Step 11: Run the tests and confirm they pass**

```bash
npx jest
```

Expected: PASS — all 8 tests across both files (2 countdown + 4 memberMatches
+ 4 filterStateBranches... note actual count is 2 + 4 + 4 = 10; just confirm
0 failures).

- [ ] **Step 12: Verify types and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add countdown and committee-search utilities with tests"
```

---

### Task 4: Shared UI primitives

**Files:**
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/type-chip.tsx`
- Create: `src/components/ui/divider.tsx`
- Create: `src/components/ui/gradient-banner.tsx`

**Interfaces:**
- Consumes: `colors`, `fontFamily`, `fontSize`, `spacing`, `radius` from `@/theme`.
- Produces: `<Badge>`, `<Card>`, `<TypeChip>`, `<Divider>`, `<GradientBanner>`
  — every screen task (9–13) imports a subset of these (see each task's own
  Interfaces line for exactly which ones).

- [ ] **Step 1: Install linear gradient support**

```bash
npx expo install expo-linear-gradient
```

- [ ] **Step 2: Badge**

Create `src/components/ui/badge.tsx`:

```tsx
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function Badge({ children, style }: { children: string; style?: ViewStyle }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.accent[200],
  },
  label: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primary[900],
  },
});
```

- [ ] **Step 3: Card**

Create `src/components/ui/card.tsx`:

```tsx
import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    shadowColor: colors.secondary[900],
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
```

- [ ] **Step 4: TypeChip**

Create `src/components/ui/type-chip.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { fontFamily, fontSize, radius, spacing } from '@/theme';

export function TypeChip({ label, bg, textColor }: { label: string; bg: string; textColor: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  label: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
```

- [ ] **Step 5: Divider**

Create `src/components/ui/divider.tsx`:

```tsx
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.surface[200],
    marginVertical: spacing.lg,
  },
});
```

- [ ] **Step 6: GradientBanner**

Create `src/components/ui/gradient-banner.tsx`:

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewStyle } from 'react-native';

export function GradientBanner({
  colors: gradientColors,
  height = 80,
  style,
}: {
  colors: [string, string];
  height?: number;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.banner, { height }, style]}
    />
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%' },
});
```

- [ ] **Step 7: Verify and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add shared UI primitives (badge, card, chips, gradient banner)"
```

---

### Task 5: Copy image and brand assets

**Files:**
- Create: `assets/committee/*.jpg` / `.png` / `.jpeg` (18 files, see mapping below)
- Create: `assets/venue/*.jpg` / `.jpeg` (6 files, see mapping below)
- Create: `assets/brand/apticon-logo.png`
- Modify: `assets/icon.png`, `assets/splash-icon.png`, `assets/android-icon-foreground.png` (overwrite)
- Modify: `app.json` (adaptive icon background color)

**Interfaces:**
- Produces: the exact local file paths that `src/data/committee.ts` (Task 7)
  and `src/data/venue.ts` (Task 6) `require()` by literal path — Metro requires
  a literal string in every `require()` call, so these paths must exist and
  match exactly before those data files are written.

- [ ] **Step 1: Copy committee photos**

Source directory: `C:\Users\C839248\apticon-2026\public\committee\`. Copy each
file to `apticon-delegates\assets\committee\` with the same filename (strip
any `?v=2` query — that's a cache-buster in the URL, not part of the filename
on disk, so the files already have clean names):

```bash
mkdir -p assets/committee assets/venue assets/brand
cp "/c/Users/C839248/apticon-2026/public/committee/national/deependra-singh.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/mihir-kar.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/milind-umekar.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/montu_patel.png" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/muttavarapu-ramana.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/pravin-chaudhari.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/raj-shekharan.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/raman-dang.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/rohit-dutt.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/sohan-chitlange.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/vandana-patravale.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/vice_chancler.png" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/national/v-murugan.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/manju-singh.jpeg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/ravindra-pandey.jpg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/satyendra-shrivastav.png" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/shailesh.jpeg" assets/committee/
cp "/c/Users/C839248/apticon-2026/public/committee/vishal-jain.jpg" assets/committee/
```

- [ ] **Step 2: Copy and rename venue/tourism photos**

Source directory: `C:\Users\C839248\apticon-2026\public\cultural\`. These have
spaces in their names on the website — rename to kebab-case on copy (Expo
Router code-style convention, and safer for tooling):

```bash
cp "/c/Users/C839248/apticon-2026/public/cultural/CHITRAKOTE.jpg" assets/venue/chitrakote-falls.jpg
cp "/c/Users/C839248/apticon-2026/public/cultural/Tirathgarh Waterfall Jagdalpur Chhattisgarh.jpg" assets/venue/tirathgarh-waterfall.jpg
cp "/c/Users/C839248/apticon-2026/public/cultural/Kanger Ghati National Park Chattisgarh.jpg" assets/venue/kanger-valley-national-park.jpg
cp "/c/Users/C839248/apticon-2026/public/cultural/kotumsar-caves-jagdalpur-chhattisgarh-1-attr-hero.jpeg" assets/venue/kotumsar-caves.jpeg
cp "/c/Users/C839248/apticon-2026/public/cultural/Ratanpur Fort.jpg" assets/venue/ratanpur-fort.jpg
cp "/c/Users/C839248/apticon-2026/public/cultural/GAURGHAAT_small_02.JPG" assets/venue/gaurighat.jpg
```

- [ ] **Step 3: Copy brand logo and replace app icon/splash**

```bash
cp "/c/Users/C839248/apticon-2026/public/logo/APTICON_LOGO.png" assets/brand/apticon-logo.png
cp "/c/Users/C839248/apticon-2026/public/logo/APTICON_EMBLEM.png" assets/icon.png
cp "/c/Users/C839248/apticon-2026/public/logo/APTICON_EMBLEM.png" assets/splash-icon.png
cp "/c/Users/C839248/apticon-2026/public/logo/APTICON_EMBLEM.png" assets/android-icon-foreground.png
```

- [ ] **Step 4: Update the Android adaptive icon background to the brand color**

In `app.json`, under `expo.android.adaptiveIcon`, change:

```json
"backgroundColor": "#E6F4FE"
```

to:

```json
"backgroundColor": "#1E1B4B"
```

- [ ] **Step 5: Verify and commit**

```bash
ls assets/committee assets/venue assets/brand
git add -A
git commit -m "feat: replace placeholder assets with real APTICON branding and photos"
```

Note: `git status` after `git add -A` should show only the new/modified files
listed above — if anything else shows up unexpectedly, investigate before
committing.

---

### Task 6: Data layer — event, schedule, venue

These three modules are small enough to write out in full.

**Files:**
- Create: `src/data/event.ts`
- Create: `src/data/schedule.ts`
- Create: `src/data/venue.ts`

**Interfaces:**
- Produces: `EVENT`, `STATS` (from `event.ts`); `SCHEDULE_DAY1`, `SCHEDULE_DAY2`,
  `SESSION_COLORS`, `SessionType`, `ScheduleSession` (from `schedule.ts`);
  `VENUE`, `TRANSPORT`, `HOTELS`, `CUISINE`, `RAIPUR_PLACES` (from `venue.ts`)
  — consumed by the Home (9), Schedule (10), and Venue (13) screens.
- Consumes: the image files placed in Task 5 (`assets/venue/*`), via literal
  `require()`.

- [ ] **Step 1: Write `event.ts`**

Ported from `apticon-2026/lib/constants.ts` (`EVENT`, `STATS`):

```ts
export const EVENT = {
  name: 'APTICON 2026',
  edition: '28th Annual National Convention',
  theme: "Pharma Teacher's Sankalp: Viksit Pharmacist for Atmanirbhar Bharat",
  themeHindi: 'फार्मा शिक्षकों का संकल्प — विकसित भारत 2047',
  vision: 'Viksit Bharat 2047',
  dateDisplay: '24th & 25th October 2026',
  startDate: new Date('2026-10-24T09:00:00+05:30'),
  venueName: 'Pt. Deendayal Upadhyay Auditorium',
  venueAddress: 'G.E. Road, Raipur (C.G.)',
  host: 'APTI Chhattisgarh State Branch',
  partner: 'University Institute of Pharmacy, Pt. Ravishankar Shukla University, Raipur (C.G.)',
  contact: 'apticon2026@gmail.com',
} as const;

export const STATS = [
  { value: '28th', label: 'Annual Convention' },
  { value: '1500+', label: 'Expected Delegates' },
  { value: '20+', label: 'Expert Speakers' },
  { value: '10,000+', label: 'APTI Members Network' },
] as const;
```

- [ ] **Step 2: Write `schedule.ts`**

Ported from `apticon-2026/lib/constants.ts` (`SCHEDULE_DAY1`, `SCHEDULE_DAY2`,
`SESSION_COLORS`), with Tailwind utility classes translated to hex:

```ts
export type SessionType =
  | 'inaugural'
  | 'keynote'
  | 'scientific'
  | 'workshop'
  | 'panel'
  | 'cultural'
  | 'valedictory'
  | 'break'
  | 'logistics';

export interface ScheduleSession {
  time: string;
  title: string;
  type: SessionType;
  hall: string;
  description?: string;
}

export const SESSION_COLORS: Record<SessionType, { bg: string; text: string }> = {
  inaugural: { bg: '#312E81', text: '#FFFFFF' },
  keynote: { bg: '#1E293B', text: '#FFFFFF' },
  scientific: { bg: '#047857', text: '#FFFFFF' },
  workshop: { bg: '#7E22CE', text: '#FFFFFF' },
  panel: { bg: '#C2410C', text: '#FFFFFF' },
  cultural: { bg: '#BE185D', text: '#FFFFFF' },
  valedictory: { bg: '#EA580C', text: '#0F172A' },
  break: { bg: '#E5E7EB', text: '#374151' },
  logistics: { bg: '#F3F4F6', text: '#4B5563' },
};

export const SCHEDULE_DAY1: ScheduleSession[] = [
  { time: '09:00 – 10:00', title: 'Registration & Welcome Kit Distribution', type: 'logistics', hall: 'Main Lobby' },
  { time: '10:00 – 11:30', title: 'Inaugural Ceremony', type: 'inaugural', hall: 'Main Auditorium', description: 'Lamp lighting, welcome address, release of souvenir' },
  { time: '11:30 – 12:30', title: 'Presidential Address', type: 'keynote', hall: 'Main Auditorium' },
  { time: '12:30 – 13:30', title: 'Lunch & Networking', type: 'break', hall: 'Dining Hall' },
  { time: '13:30 – 15:00', title: "Keynote: Viksit Bharat 2047 — Pharmacy's Role", type: 'keynote', hall: 'Main Auditorium' },
  { time: '15:00 – 16:30', title: 'Scientific Session I: Pharmaceutical Education Innovation', type: 'scientific', hall: 'Hall A' },
  { time: '16:30 – 17:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { time: '17:00 – 18:30', title: 'Scientific Session II: Drug Discovery & Development', type: 'scientific', hall: 'Hall A' },
  { time: '19:00 – 21:00', title: 'Cultural Evening — Chhattisgarhi Folk Performances', type: 'cultural', hall: 'Open Stage' },
];

export const SCHEDULE_DAY2: ScheduleSession[] = [
  { time: '09:00 – 10:30', title: 'Keynote: Atmanirbhar Bharat — Indigenous Pharma', type: 'keynote', hall: 'Main Auditorium' },
  { time: '10:30 – 12:00', title: 'Scientific Session III: Clinical Pharmacy & Pharmacovigilance', type: 'scientific', hall: 'Hall A' },
  { time: '12:00 – 13:00', title: 'Workshop: Outcome-Based Pharmacy Education', type: 'workshop', hall: 'Hall B' },
  { time: '13:00 – 14:00', title: 'Lunch', type: 'break', hall: 'Dining Hall' },
  { time: '14:00 – 15:30', title: 'Scientific Session IV: Herbal Medicine & Traditional Knowledge', type: 'scientific', hall: 'Hall A' },
  { time: '15:30 – 16:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { time: '16:00 – 17:00', title: 'Panel Discussion: Future of Pharmacy Education in India', type: 'panel', hall: 'Main Auditorium' },
  { time: '17:00 – 18:00', title: 'Valedictory Ceremony & Awards', type: 'valedictory', hall: 'Main Auditorium' },
];
```

- [ ] **Step 3: Write `venue.ts`**

Ported from `apticon-2026/app/venue/VenueClient.tsx` (`TRANSPORT`, `HOTELS`,
`CUISINE`) and `apticon-2026/lib/constants.ts` (`RAIPUR_PLACES`). Icons use
`lucide-react-native` component references, matching the website's
`lucide-react` usage 1:1:

```ts
import type { ImageSourcePropType } from 'react-native';
import { Plane, Train, Car, type LucideIcon } from 'lucide-react-native';

export const VENUE = {
  name: 'Pt. Deendayal Upadhyay Auditorium',
  address: 'G.E. Road, Raipur, C.G. — 492001',
  lat: 21.2514,
  lng: 81.6296,
  features: [
    'Large auditorium seating 1000+',
    'Multiple breakout halls',
    'Central air-conditioning',
    'Ample parking facility',
    'Accessible for differently-abled',
  ],
};

export interface TransportOption {
  icon: LucideIcon;
  label: string;
  title: string;
  details: string[];
}

export const TRANSPORT: TransportOption[] = [
  {
    icon: Plane,
    label: 'By Air',
    title: 'Swami Vivekananda Airport (RPR)',
    details: ['~15 km from venue', 'Flights from Delhi, Mumbai, Hyderabad, Kolkata, Bengaluru', 'Taxi/cab easily available'],
  },
  {
    icon: Train,
    label: 'By Train',
    title: 'Raipur Junction Railway Station',
    details: ['~5 km from venue', 'On Mumbai–Howrah & Delhi–Chennai rail corridors', 'Shatabdi, Rajdhani, Duronto connectivity'],
  },
  {
    icon: Car,
    label: 'By Road',
    title: 'National Highway Connectivity',
    details: ['NH 30 (Raipur–Jagdalpur)', 'NH 53 (Raipur–Nagpur)', 'State bus services from all CG districts'],
  },
];

export interface Hotel {
  name: string;
  stars: number;
  distance: string;
  area: string;
}

export const HOTELS: Hotel[] = [
  { name: 'Hotel Babylon International', stars: 4, distance: '1.2 km', area: 'GE Road' },
  { name: 'Hotel Piccadily', stars: 4, distance: '2.0 km', area: 'Fafadih' },
  { name: 'Hotel Nanking', stars: 3, distance: '0.8 km', area: 'GE Road' },
  { name: 'Hotel Celebration', stars: 3, distance: '1.5 km', area: 'Shankar Nagar' },
  { name: 'OYO / Budget Guesthouses', stars: 2, distance: '0.5–2 km', area: 'Near Venue' },
];

export interface CuisineItem {
  name: string;
  desc: string;
  icon: string;
}

export const CUISINE: CuisineItem[] = [
  { name: 'Chila', desc: 'Rice flour pancakes — a Chhattisgarhi breakfast staple', icon: '🥞' },
  { name: 'Bafauri', desc: 'Steamed dal dumplings, light and nutritious', icon: '🍥' },
  { name: 'Aamat', desc: 'Spicy vegetable curry with Bastar forest ingredients', icon: '🍲' },
  { name: 'Muthia', desc: 'Spiced dumplings in tangy mustard gravy', icon: '🥣' },
  { name: 'Fara', desc: 'Steamed rice rolls with spicy stuffing', icon: '🌯' },
  { name: 'Kusli', desc: 'Deep-fried sweet snack, perfect for celebrations', icon: '🍩' },
];

export interface RaipurPlace {
  name: string;
  description: string;
  icon: string;
  image: ImageSourcePropType;
}

export const RAIPUR_PLACES: RaipurPlace[] = [
  {
    name: 'Chitrakote Falls',
    description: "India's widest waterfall — the horseshoe-shaped 'Niagara of India' on the Indravati River.",
    icon: '💦',
    image: require('../../assets/venue/chitrakote-falls.jpg'),
  },
  {
    name: 'Tirathgarh Waterfall',
    description: 'A multi-tiered cascade inside Kanger Valley National Park, framed by dense sal forest.',
    icon: '💧',
    image: require('../../assets/venue/tirathgarh-waterfall.jpg'),
  },
  {
    name: 'Kanger Valley National Park',
    description: "A biosphere reserve of caves, waterfalls and rare orchids deep in Bastar's forests.",
    icon: '🌳',
    image: require('../../assets/venue/kanger-valley-national-park.jpg'),
  },
  {
    name: 'Kotumsar Caves',
    description: 'Ancient limestone caves with striking stalactite and stalagmite formations.',
    icon: '🦇',
    image: require('../../assets/venue/kotumsar-caves.jpeg'),
  },
  {
    name: 'Ratanpur Fort',
    description: 'A Kalachuri-era fort and temple town, once capital of the ancient Chhattisgarh kingdom.',
    icon: '🏰',
    image: require('../../assets/venue/ratanpur-fort.jpg'),
  },
  {
    name: 'Gaurighat',
    description: 'A tranquil riverside ghat and waterfall pool, a favourite escape near Raipur.',
    icon: '🌅',
    image: require('../../assets/venue/gaurighat.jpg'),
  },
];
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add event, schedule, and venue data"
```

---

### Task 7: Data layer — committee (large, mechanically ported)

This is the largest data module (~150 people). It is ported mechanically from
two existing source files rather than re-typed by hand.

**Files:**
- Create: `src/data/committee.ts`

**Interfaces:**
- Consumes: `CommitteeMember`, `StateBranch` types from `@/utils/committee-search`
  (Task 3) — re-exported here so screens import everything committee-related
  from one place.
- Produces: `PINNED_GROUPS: CommitteeGroup[]`, `STATE_BRANCHES: StateBranch[]`
  — consumed by the Committee screen (Task 12).
- Consumes: the image files placed in Task 5 (`assets/committee/*`), via
  literal `require()`.

- [ ] **Step 1: Define the module's group type**

At the top of `src/data/committee.ts`:

```ts
import type { CommitteeMember, StateBranch } from '@/utils/committee-search';

export type { CommitteeMember, StateBranch };

export interface CommitteeGroup {
  key: string;
  title: string;
  gradient: [string, string];
  members: CommitteeMember[];
}
```

- [ ] **Step 2: Port `NATIONAL_BODY`**

Read `C:\Users\C839248\apticon-2026\lib\committee-data.ts` lines 15–120
(`NATIONAL_BODY`). Copy every entry's `name`, `role`, `designation`,
`institution`, `email` verbatim. For `image`, apply this rule:

- If the value is a full `https://...` URL (only Dr. Anil M Pethe, line 85):
  keep it as `image: { uri: 'https://aptiindia.org/images/committee/anilpethe.png' }`.
- Otherwise (a `/committee/national/xxx.jpg?v=2` path): strip the leading
  `/committee/national/` and the trailing `?v=2`, and use
  `image: require('../../assets/committee/<filename>')` — e.g.
  `"/committee/national/milind-umekar.jpg?v=2"` becomes
  `require('../../assets/committee/milind-umekar.jpg')`.

Add the resulting array to `src/data/committee.ts` as:

```ts
const NATIONAL_BODY: CommitteeMember[] = [
  // ... 12 entries, ported per the rule above
];
```

- [ ] **Step 3: Port the remaining pinned groups**

Read `C:\Users\C839248\apticon-2026\app\committee\CommitteeClient.tsx` lines
19–211 (the `COMMITTEE` array literal, excluding the `National Body` entry
already ported in Step 2 — its members are identical to `NATIONAL_BODY` and
must not be duplicated). For each of the other five groups (`Patrons`,
`Local Organizing Committee`, `Organizing Secretariat`, `Registration
Committee`, `Scientific Committee`), copy the members verbatim and apply the
same image rule as Step 2 (local `/committee/xxx.png` paths →
`require('../../assets/committee/xxx.png')`; entries with no `image` field
stay without one).

Add each as its own local array, e.g.:

```ts
const PATRONS: CommitteeMember[] = [ /* 3 entries */ ];
const LOCAL_ORGANIZING_COMMITTEE: CommitteeMember[] = [ /* 5 entries */ ];
const ORGANIZING_SECRETARIAT: CommitteeMember[] = [ /* 9 entries */ ];
const REGISTRATION_COMMITTEE: CommitteeMember[] = [ /* 2 entries */ ];
const SCIENTIFIC_COMMITTEE: CommitteeMember[] = [ /* 1 entry */ ];
```

- [ ] **Step 4: Assemble `PINNED_GROUPS`**

Gradient colors are ported from the website's Tailwind gradient classes,
translated to hex pairs:

```ts
export const PINNED_GROUPS: CommitteeGroup[] = [
  { key: 'national', title: 'National Body', gradient: ['#312E81', '#EA580C'], members: NATIONAL_BODY },
  { key: 'patrons', title: 'Patrons', gradient: ['#EA580C', '#B45309'], members: PATRONS },
  { key: 'loc', title: 'Local Organizing Committee', gradient: ['#312E81', '#1E1B4B'], members: LOCAL_ORGANIZING_COMMITTEE },
  { key: 'secretariat', title: 'Organizing Secretariat', gradient: ['#1E293B', '#0F172A'], members: ORGANIZING_SECRETARIAT },
  { key: 'registration', title: 'Registration Committee', gradient: ['#047857', '#064E3B'], members: REGISTRATION_COMMITTEE },
  { key: 'scientific', title: 'Scientific Committee', gradient: ['#BE185D', '#831843'], members: SCIENTIFIC_COMMITTEE },
];
```

- [ ] **Step 5: Port `STATE_BRANCHES`**

Read `C:\Users\C839248\apticon-2026\lib\committee-data.ts` lines 122–1040
(`STATE_BRANCHES`, 28 states). Copy the whole array verbatim, applying the
same image rule as Step 2 to every member's `image` field (the large majority
here are `https://aptiindia.org/...` remote URLs — leave those as
`{ uri: '...' }`; the few `/committee/...` local paths follow the `require()`
rule). Add it as:

```ts
export const STATE_BRANCHES: StateBranch[] = [
  // ... 28 state entries, ported per the rule above
];
```

- [ ] **Step 6: Verify the counts**

```bash
node -e "
const ts = require('fs').readFileSync('src/data/committee.ts', 'utf8');
console.log('state entries:', (ts.match(/state:\s*'/g) || []).length);
"
```

Expected: `state entries: 28`.

- [ ] **Step 7: Verify types and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: port committee data (national body, core groups, 28 state branches)"
```

---

### Task 8: Tabs navigation shell

**Files:**
- Create: `src/app/(tabs)/_layout.tsx`
- Create: `src/app/(tabs)/index.tsx` (placeholder)
- Create: `src/app/(tabs)/schedule.tsx` (placeholder)
- Create: `src/app/(tabs)/committee.tsx` (placeholder)
- Create: `src/app/(tabs)/speakers.tsx` (placeholder)
- Create: `src/app/(tabs)/venue.tsx` (placeholder)
- Delete: `src/app/index.tsx` (superseded by `(tabs)/index.tsx`)

**Interfaces:**
- Consumes: `colors`, `fontFamily` from `@/theme`.
- Produces: the 5-route shell every screen task (9–13) fills in — each
  placeholder route default-exports a component that the corresponding task
  replaces with real content (same file path, same default export).

- [ ] **Step 1: Install tab icons**

```bash
npx expo install lucide-react-native react-native-svg
```

- [ ] **Step 2: Remove the now-superseded single route**

```bash
rm src/app/index.tsx
```

- [ ] **Step 3: Create the tabs layout**

Create `src/app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';
import { CalendarDays, Home, MapPin, Mic, Users } from 'lucide-react-native';
import { colors, fontFamily } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: { fontFamily: fontFamily.sansMedium, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.surface[200] },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="committee"
        options={{ title: 'Committee', tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="speakers"
        options={{ title: 'Speakers', tabBarIcon: ({ color, size }) => <Mic color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="venue"
        options={{ title: 'Venue', tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} /> }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 4: Create the 5 placeholder routes**

Create each of these with the same shape (swap the label per file):

`src/app/(tabs)/index.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';

export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

Repeat for `src/app/(tabs)/schedule.tsx` (`Text` → "Schedule",
`ScheduleRoute`), `src/app/(tabs)/committee.tsx` ("Committee",
`CommitteeRoute`), `src/app/(tabs)/speakers.tsx` ("Speakers",
`SpeakersRoute`), `src/app/(tabs)/venue.tsx` ("Venue", `VenueRoute`).

- [ ] **Step 5: Verify all 5 tabs are reachable**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: the app opens on a bottom-tab layout with 5 tabs (Home, Schedule,
Committee, Speakers, Venue); tapping each shows its placeholder label with no
errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add 5-tab navigation shell"
```

---

### Task 9: Home screen

**Files:**
- Create: `src/screens/home/index.tsx`
- Create: `src/screens/home/countdown-row.tsx`
- Create: `src/screens/home/quick-nav-card.tsx`
- Modify: `src/app/(tabs)/index.tsx`

**Interfaces:**
- Consumes: `EVENT`, `STATS` from `@/data/event`; `useCountdown` from
  `@/hooks/use-countdown`; `Card`, `Badge`, `Divider` from
  `@/components/ui/*`; `colors`, `fontFamily`, `fontSize`, `spacing` from
  `@/theme`; navigates via `Link` from `expo-router`.

- [ ] **Step 1: Countdown row component**

Create `src/screens/home/countdown-row.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { useCountdown } from '@/hooks/use-countdown';
import { colors, fontFamily, fontSize, spacing } from '@/theme';

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.value}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function CountdownRow({ target }: { target: Date }) {
  const { days, hours, minutes, isPast } = useCountdown(target);

  if (isPast) {
    return <Text style={styles.live}>APTICON 2026 is here!</Text>;
  }

  return (
    <View style={styles.row}>
      <Unit value={days} label="Days" />
      <Unit value={hours} label="Hours" />
      <Unit value={minutes} label="Mins" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'center' },
  unit: { alignItems: 'center', minWidth: 56 },
  value: { fontFamily: fontFamily.displayBlack, fontSize: fontSize['2xl'], color: colors.white },
  label: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.xs, color: colors.accent[200], textTransform: 'uppercase' },
  live: { fontFamily: fontFamily.display, fontSize: fontSize.lg, color: colors.white, textAlign: 'center' },
});
```

- [ ] **Step 2: Quick-nav card component**

Create `src/screens/home/quick-nav-card.tsx`:

```tsx
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function QuickNavCard({ href, icon: Icon, label }: { href: Href; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon color={colors.white} size={20} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
});
```

- [ ] **Step 3: Home screen body**

Create `src/screens/home/index.tsx`:

```tsx
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, MapPin, Mic, Users } from 'lucide-react-native';
import { EVENT, STATS } from '@/data/event';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { CountdownRow } from './countdown-row';
import { QuickNavCard } from './quick-nav-card';

export function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={require('../../../assets/brand/apticon-logo.png')} style={styles.logo} resizeMode="contain" />
        <Badge>{EVENT.edition}</Badge>
        <Text style={styles.title}>{EVENT.name}</Text>
        <Text style={styles.theme}>{EVENT.theme}</Text>
        <Text style={styles.dates}>{EVENT.dateDisplay} · {EVENT.venueName}</Text>
        <CountdownRow target={EVENT.startDate} />
      </View>

      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Explore APTICON 2026</Text>
      <View style={styles.grid}>
        <QuickNavCard href="/schedule" icon={CalendarDays} label="Schedule" />
        <QuickNavCard href="/committee" icon={Users} label="Committee" />
        <QuickNavCard href="/speakers" icon={Mic} label="Speakers" />
        <QuickNavCard href="/venue" icon={MapPin} label="Venue" />
      </View>

      <Card style={styles.hostCard}>
        <Text style={styles.hostTitle}>Hosted by</Text>
        <Text style={styles.hostBody}>{EVENT.host}, in partnership with {EVENT.partner}.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  content: { paddingBottom: spacing['3xl'] },
  hero: {
    backgroundColor: colors.primary[900],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: { width: 96, height: 96, marginBottom: spacing.sm },
  title: {
    fontFamily: fontFamily.displayBlack,
    fontSize: fontSize['3xl'],
    color: colors.white,
    textAlign: 'center',
  },
  theme: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    color: colors.surface[100],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  dates: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.accent[200],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.primary[700] },
  statLabel: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted, textAlign: 'center', marginTop: 2 },
  sectionTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.lg,
    color: colors.text.dark,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  hostCard: { marginHorizontal: spacing.lg, marginTop: spacing.xl },
  hostTitle: { fontFamily: fontFamily.sansBold, fontSize: fontSize.sm, color: colors.primary[700], marginBottom: spacing.xs },
  hostBody: { fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, lineHeight: 22 },
});
```

- [ ] **Step 4: Wire the route**

`src/screens/home/index.tsx` (from Step 3) already exports `HomeScreen`
directly, and Metro resolves `@/screens/home` to that file automatically
(it's the directory's `index.tsx`) — no barrel file is needed.

Replace `src/app/(tabs)/index.tsx`:

```tsx
import { HomeScreen } from '@/screens/home';

export default function HomeRoute() {
  return <HomeScreen />;
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: Home tab shows the logo, title, theme line, live countdown
(days/hours/mins ticking), stat row, 4 quick-nav cards that navigate to the
other tabs, and the host card. No errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: build Home screen with countdown and quick nav"
```

---

### Task 10: Schedule screen

**Files:**
- Create: `src/screens/schedule/index.tsx`
- Create: `src/screens/schedule/session-card.tsx`
- Create: `src/screens/schedule/day-toggle.tsx`
- Modify: `src/app/(tabs)/schedule.tsx`

**Interfaces:**
- Consumes: `SCHEDULE_DAY1`, `SCHEDULE_DAY2`, `SESSION_COLORS`,
  `ScheduleSession` from `@/data/schedule`; `Badge`, `TypeChip` from
  `@/components/ui/*`.

- [ ] **Step 1: Day toggle**

Create `src/screens/schedule/day-toggle.tsx`:

```tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export interface DayOption {
  key: string;
  label: string;
}

export function DayToggle({
  options,
  active,
  onChange,
}: {
  options: DayOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
  },
  pillActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  labelActive: { color: colors.white },
});
```

- [ ] **Step 2: Session card**

Create `src/screens/schedule/session-card.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import type { ScheduleSession } from '@/data/schedule';
import { SESSION_COLORS } from '@/data/schedule';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function SessionCard({ session }: { session: ScheduleSession }) {
  const palette = SESSION_COLORS[session.type];
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{session.time}</Text>
      <View style={styles.body}>
        <TypeChip label={session.type} bg={palette.bg} textColor={palette.text} />
        <Text style={styles.title}>{session.title}</Text>
        {session.description ? <Text style={styles.description}>{session.description}</Text> : null}
        <Text style={styles.hall}>{session.hall}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  time: { width: 92, fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.muted },
  body: { flex: 1, gap: spacing.xs },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  description: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  hall: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
});
```

Note: `radius` is imported but unused in this file if not referenced — remove
the unused import if `tsc`/lint flags it (it isn't used above; import only
`colors, fontFamily, fontSize, spacing`).

- [ ] **Step 3: Screen body**

Create `src/screens/schedule/index.tsx`:

```tsx
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SESSION_COLORS, type SessionType } from '@/data/schedule';
import { Badge } from '@/components/ui/badge';
import { TypeChip } from '@/components/ui/type-chip';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { DayToggle } from './day-toggle';
import { SessionCard } from './session-card';

const DAYS = [
  { key: 'day1', label: 'Day 1 — 24 Oct', sessions: SCHEDULE_DAY1 },
  { key: 'day2', label: 'Day 2 — 25 Oct', sessions: SCHEDULE_DAY2 },
];

export function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState('day1');
  const day = DAYS.find((d) => d.key === activeDay) ?? DAYS[0];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Badge>Program</Badge>
        <Text style={styles.title}>Conference Schedule</Text>
      </View>
      <DayToggle options={DAYS} active={activeDay} onChange={setActiveDay} />
      <FlatList
        data={day.sessions}
        keyExtractor={(item, index) => `${activeDay}-${index}`}
        renderItem={({ item }) => <SessionCard session={item} />}
        ListFooterComponent={<Legend />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function Legend() {
  const types = Object.keys(SESSION_COLORS) as SessionType[];
  return (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>Session Types</Text>
      <View style={styles.legendRow}>
        {types.map((type) => (
          <TypeChip key={type} label={type} bg={SESSION_COLORS[type].bg} textColor={SESSION_COLORS[type].text} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], gap: spacing.sm },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark },
  listContent: { paddingBottom: spacing['3xl'] },
  legend: { padding: spacing.lg, gap: spacing.md },
  legendTitle: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.muted },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
```

- [ ] **Step 4: Wire the route**

Replace `src/app/(tabs)/schedule.tsx`:

```tsx
import { ScheduleScreen } from '@/screens/schedule';

export default function ScheduleRoute() {
  return <ScheduleScreen />;
}
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: Schedule tab shows Day 1/Day 2 toggle, a scrollable list of session
cards with colored type chips matching `SESSION_COLORS`, and a legend at the
bottom listing all 9 session types.

```bash
git add -A
git commit -m "feat: build Schedule screen with day toggle and session list"
```

---

### Task 11: Speakers screen

**Files:**
- Create: `src/screens/speakers/index.tsx`
- Modify: `src/app/(tabs)/speakers.tsx`

**Interfaces:**
- Consumes: `colors`, `fontFamily`, `fontSize`, `spacing` from `@/theme`;
  `Badge` from `@/components/ui/badge`.

- [ ] **Step 1: Screen body**

Create `src/screens/speakers/index.tsx`:

```tsx
import { Mic } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { colors, fontFamily, fontSize, spacing } from '@/theme';

export function SpeakersScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.iconWrap}>
        <Mic color={colors.primary[700]} size={40} />
      </View>
      <Badge>Distinguished Speakers</Badge>
      <Text style={styles.title}>Speakers Being Announced</Text>
      <Text style={styles.body}>
        We are curating an outstanding lineup of pharmacy educators and industry
        leaders for APTICON 2026. Check back closer to the event for the full
        speaker list.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface[50],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[700] + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark, textAlign: 'center' },
  body: { fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, textAlign: 'center', lineHeight: 22 },
});
```

- [ ] **Step 2: Wire the route**

Replace `src/app/(tabs)/speakers.tsx`:

```tsx
import { SpeakersScreen } from '@/screens/speakers';

export default function SpeakersRoute() {
  return <SpeakersScreen />;
}
```

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: Speakers tab shows a centered mic icon, "Distinguished Speakers"
badge, "Speakers Being Announced" heading, and the supporting paragraph — no
placeholder speaker cards.

```bash
git add -A
git commit -m "feat: build Speakers empty-state screen"
```

---

### Task 12: Committee screen

**Files:**
- Create: `src/screens/committee/index.tsx`
- Create: `src/screens/committee/member-card.tsx`
- Create: `src/screens/committee/state-accordion-row.tsx`
- Create: `src/screens/committee/search-bar.tsx`
- Modify: `src/app/(tabs)/committee.tsx`

**Interfaces:**
- Consumes: `PINNED_GROUPS`, `STATE_BRANCHES`, `CommitteeMember`,
  `CommitteeGroup`, `StateBranch` from `@/data/committee`; `memberMatches`,
  `filterStateBranches` from `@/utils/committee-search`; `GradientBanner` from
  `@/components/ui/gradient-banner`.

- [ ] **Step 1: Search bar**

Create `src/screens/committee/search-bar.tsx`:

```tsx
import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function SearchBar({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  return (
    <View style={styles.container}>
      <Search color={colors.text.muted} size={16} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search committee by name, state, or institution..."
        placeholderTextColor={colors.text.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 44,
  },
  input: { flex: 1, fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.dark },
});
```

- [ ] **Step 2: Member card**

Create `src/screens/committee/member-card.tsx`:

```tsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import type { CommitteeMember } from '@/data/committee';
import { GradientBanner } from '@/components/ui/gradient-banner';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function MemberCard({ member, gradient }: { member: CommitteeMember; gradient: [string, string] }) {
  return (
    <View style={styles.card}>
      <GradientBanner colors={gradient} height={48} />
      <View style={styles.avatarWrap}>
        {member.image ? (
          <Image source={member.image} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: gradient[0] }]}>
            <User color={colors.white} size={22} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        {member.role ? <Text style={styles.role}>{member.role}</Text> : null}
        <Text style={styles.name}>{member.name}</Text>
        {member.designation ? <Text style={styles.meta}>{member.designation}</Text> : null}
        {member.institution ? (
          <Text style={styles.meta} numberOfLines={2}>{member.institution}</Text>
        ) : null}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  avatarWrap: { marginTop: -AVATAR_SIZE / 2, marginBottom: spacing.sm },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  body: { alignItems: 'center', paddingHorizontal: spacing.sm, gap: 2 },
  role: {
    fontFamily: fontFamily.sansBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.accent[500],
  },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.text.dark, textAlign: 'center' },
  meta: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted, textAlign: 'center' },
});
```

- [ ] **Step 3: State accordion row**

Create `src/screens/committee/state-accordion-row.tsx`:

```tsx
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StateBranch } from '@/data/committee';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { MemberCard } from './member-card';

export function StateAccordionRow({ branch, forceOpen }: { branch: StateBranch; forceOpen: boolean }) {
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const isOpen = forceOpen || manuallyOpen;

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setManuallyOpen((v) => !v)}>
        {isOpen ? <ChevronDown color={colors.text.muted} size={16} /> : <ChevronRight color={colors.text.muted} size={16} />}
        <Text style={styles.stateName}>{branch.state}</Text>
        <Text style={styles.count}>{branch.members.length}</Text>
      </Pressable>
      {isOpen ? (
        <View style={styles.grid}>
          {branch.members.map((member, index) => (
            <MemberCard key={`${branch.state}-${index}`} member={member} gradient={['#1E293B', '#0F172A']} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  stateName: { flex: 1, fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  count: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.md, paddingTop: spacing.xl },
});
```

- [ ] **Step 4: Screen body**

Create `src/screens/committee/index.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PINNED_GROUPS, STATE_BRANCHES } from '@/data/committee';
import { memberMatches, filterStateBranches } from '@/utils/committee-search';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { SearchBar } from './search-bar';
import { MemberCard } from './member-card';
import { StateAccordionRow } from './state-accordion-row';

export function CommitteeScreen() {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  const filteredGroups = useMemo(
    () =>
      PINNED_GROUPS.map((group) => ({
        ...group,
        members: group.members.filter((m) => memberMatches(m, trimmedQuery)),
      })).filter((group) => group.members.length > 0),
    [trimmedQuery]
  );

  const filteredBranches = useMemo(
    () => filterStateBranches(STATE_BRANCHES, trimmedQuery),
    [trimmedQuery]
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Organizing Committee</Text>
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        data={filteredBranches}
        keyExtractor={(branch) => branch.state}
        ListHeaderComponent={
          <View>
            {filteredGroups.map((group) => (
              <View key={group.key} style={styles.pinnedGroup}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.grid}>
                  {group.members.map((member, index) => (
                    <MemberCard key={`${group.key}-${index}`} member={member} gradient={group.gradient} />
                  ))}
                </View>
              </View>
            ))}
            <Text style={styles.groupTitle}>State APTI Branches</Text>
          </View>
        }
        renderItem={({ item }) => <StateAccordionRow branch={item} forceOpen={trimmedQuery.length > 0} />}
        ListEmptyComponent={
          trimmedQuery && filteredGroups.length === 0 ? (
            <Text style={styles.empty}>No committee members match "{trimmedQuery}".</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xl,
    color: colors.text.dark,
    marginHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  listContent: { paddingBottom: spacing['3xl'] },
  pinnedGroup: { marginBottom: spacing.xl },
  groupTitle: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.text.muted,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  empty: { textAlign: 'center', fontFamily: fontFamily.sans, fontSize: fontSize.base, color: colors.text.muted, marginTop: spacing.xl },
});
```

- [ ] **Step 5: Wire the route**

Replace `src/app/(tabs)/committee.tsx`:

```tsx
import { CommitteeScreen } from '@/screens/committee';

export default function CommitteeRoute() {
  return <CommitteeScreen />;
}
```

- [ ] **Step 6: Verify and commit**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: Committee tab shows the search bar; National Body / Patrons / LOC /
Secretariat / Registration / Scientific groups rendered as open member-card
grids; below them, 28 collapsed state rows that expand on tap; typing a name
or state into the search box auto-expands matching states and hides
non-matching members/groups.

```bash
git add -A
git commit -m "feat: build Committee screen with search and state accordion"
```

---

### Task 13: Venue screen

**Files:**
- Create: `src/screens/venue/index.tsx`
- Create: `src/screens/venue/transport-card.tsx`
- Create: `src/screens/venue/place-card.tsx`
- Modify: `src/app/(tabs)/venue.tsx`

**Interfaces:**
- Consumes: `VENUE`, `TRANSPORT`, `HOTELS`, `CUISINE`, `RAIPUR_PLACES` from
  `@/data/venue`; `Card`, `Divider`, `Badge` from `@/components/ui/*`;
  `Linking` from `react-native`.

- [ ] **Step 1: Transport card**

Create `src/screens/venue/transport-card.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import type { TransportOption } from '@/data/venue';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function TransportCard({ option }: { option: TransportOption }) {
  const Icon = option.icon;
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon color={colors.white} size={20} />
      </View>
      <Text style={styles.label}>{option.label}</Text>
      <Text style={styles.title}>{option.title}</Text>
      {option.details.map((detail) => (
        <Text key={detail} style={styles.detail}>• {detail}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { fontFamily: fontFamily.sansBold, fontSize: fontSize.xs, color: colors.accent[500], textTransform: 'uppercase' },
  title: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark, marginBottom: spacing.xs },
  detail: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
});
```

- [ ] **Step 2: Place card**

Create `src/screens/venue/place-card.tsx`:

```tsx
import { Image, StyleSheet, Text, View } from 'react-native';
import type { RaipurPlace } from '@/data/venue';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export function PlaceCard({ place }: { place: RaipurPlace }) {
  return (
    <View style={styles.card}>
      <Image source={place.image} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>{place.icon} {place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: { width: '100%', height: 160 },
  body: { padding: spacing.md, gap: spacing.xs },
  name: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.base, color: colors.text.dark },
  description: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted, lineHeight: 20 },
});
```

- [ ] **Step 3: Screen body**

Create `src/screens/venue/index.tsx`:

```tsx
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { VENUE, TRANSPORT, HOTELS, CUISINE, RAIPUR_PLACES } from '@/data/venue';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { TransportCard } from './transport-card';
import { PlaceCard } from './place-card';

function openInMaps() {
  const url = `https://www.google.com/maps/search/?api=1&query=${VENUE.lat},${VENUE.lng}`;
  Linking.openURL(url);
}

export function VenueScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Badge>Venue & Travel</Badge>
        <Text style={styles.title}>{VENUE.name}</Text>
        <Text style={styles.address}>{VENUE.address}</Text>
      </View>

      <Card style={styles.venueCard}>
        {VENUE.features.map((feature) => (
          <Text key={feature} style={styles.feature}>• {feature}</Text>
        ))}
        <Pressable style={styles.mapsButton} onPress={openInMaps}>
          <MapPin color={colors.white} size={16} />
          <Text style={styles.mapsButtonLabel}>Open in Google Maps</Text>
        </Pressable>
      </Card>

      <Text style={styles.sectionTitle}>Nearby Hotels</Text>
      <Card>
        {HOTELS.map((hotel) => (
          <View key={hotel.name} style={styles.hotelRow}>
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelArea}>{hotel.area}</Text>
            </View>
            <View style={styles.hotelMeta}>
              <Text style={styles.hotelDistance}>{hotel.distance}</Text>
              <Text style={styles.hotelStars}>{'★'.repeat(hotel.stars)}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Divider />

      <Text style={styles.sectionTitle}>How to Reach Raipur</Text>
      <View style={styles.list}>
        {TRANSPORT.map((option) => (
          <TransportCard key={option.label} option={option} />
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Explore Raipur & Chhattisgarh</Text>
      <View style={styles.list}>
        {RAIPUR_PLACES.map((place) => (
          <PlaceCard key={place.name} place={place} />
        ))}
      </View>

      <Divider />

      <Text style={styles.sectionTitle}>Taste of Chhattisgarh</Text>
      <View style={styles.cuisineGrid}>
        {CUISINE.map((item) => (
          <View key={item.name} style={styles.cuisineCard}>
            <Text style={styles.cuisineIcon}>{item.icon}</Text>
            <Text style={styles.cuisineName}>{item.name}</Text>
            <Text style={styles.cuisineDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface[50] },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'], gap: spacing.md },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.text.dark },
  address: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  venueCard: { gap: spacing.xs },
  feature: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.text.muted },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[700],
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  mapsButtonLabel: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.sm, color: colors.white },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: fontSize.base, color: colors.text.dark, marginTop: spacing.sm },
  hotelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  hotelInfo: { flex: 1 },
  hotelName: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.text.dark },
  hotelArea: { fontFamily: fontFamily.sans, fontSize: fontSize.xs, color: colors.text.muted },
  hotelMeta: { alignItems: 'flex-end' },
  hotelDistance: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.primary[700] },
  hotelStars: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted },
  list: { gap: 0 },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cuisineCard: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  cuisineIcon: { fontSize: 24 },
  cuisineName: { fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.xs, color: colors.text.dark },
  cuisineDesc: { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text.muted, textAlign: 'center' },
});
```

- [ ] **Step 4: Wire the route**

Replace `src/app/(tabs)/venue.tsx`:

```tsx
import { VenueScreen } from '@/screens/venue';

export default function VenueRoute() {
  return <VenueScreen />;
}
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
npx expo start --web --clear
```

Expected: Venue tab shows the venue card with feature list and a working
"Open in Google Maps" button, nearby hotels list, 3 how-to-reach cards,
6 Raipur/Chhattisgarh tourism place cards with photos, and a 6-item cuisine
grid.

```bash
git add -A
git commit -m "feat: build Venue screen with maps link, hotels, transport, tourism"
```

---

### Task 14: Final integration polish and manual QA

**Files:**
- Modify: any file, as needed to fix issues found during this pass (no new
  files expected).

**Interfaces:** none — this task only verifies and fixes what Tasks 1–13
already produced.

- [ ] **Step 1: Full type check**

```bash
npx tsc --noEmit
```

Expected: zero errors. Fix any that surface before continuing.

- [ ] **Step 2: Full test suite**

```bash
npx jest
```

Expected: all tests pass (countdown + committee-search).

- [ ] **Step 3: Manual walkthrough on web**

```bash
npx expo start --web --clear
```

Walk through and confirm for each tab:
- **Home**: logo, countdown ticking, stat row, 4 quick-nav cards navigate
  correctly to their tabs.
- **Schedule**: Day 1 / Day 2 toggle switches session lists; type chips are
  colored per `SESSION_COLORS`; legend renders all 9 types.
- **Committee**: all 6 pinned groups render with photos where available and
  a fallback avatar icon otherwise; typing "chhattisgarh" auto-expands that
  state and narrows other groups; typing a name (e.g. "vyas") narrows to
  matching members only; clearing the search restores all 28 collapsed
  states.
- **Speakers**: clean empty state, no placeholder names.
- **Venue**: "Open in Google Maps" opens a maps URL in a new tab (web) or the
  Maps app (native); all 6 tourism photos load; hotel list and cuisine grid
  render.

- [ ] **Step 4: Manual walkthrough on a native target**

Run on Android emulator, iOS simulator, or Expo Go (whichever is available in
this environment):

```bash
npx expo start --clear
```

Confirm the same 5 tabs render correctly, local `require()`'d images (member
photos, tourism photos, logo, app icon) display without broken-image
placeholders, and the tab bar icons/colors match the web pass.

- [ ] **Step 5: Side-by-side brand check against the live site**

Open `apticon.in`'s Committee and Venue pages next to the app and confirm:
primary indigo / accent orange usage is visually consistent, Playfair
Display renders on headings, Inter renders on body text, and content
(names, dates, addresses) matches the source data files.

- [ ] **Step 6: Fix anything found, then final commit**

Fix issues discovered in Steps 1–5 directly in the relevant files from Tasks
1–13 (no placeholders — implement the actual fix). Then:

```bash
npx tsc --noEmit
npx jest
git add -A
git commit -m "fix: polish pass after full walkthrough"
```

If no issues are found, skip the commit — there is nothing to commit.
