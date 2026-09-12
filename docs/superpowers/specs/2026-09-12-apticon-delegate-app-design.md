# APTICON Delegate App — Design Spec

Date: 2026-09-12
Status: Approved by user, ready for implementation planning

## Purpose

`apticon-delegates` is currently a bare Expo scaffold (default template `App.tsx`,
no navigation, no screens). This spec turns it into a complete, professional,
read-only delegate companion app for APTICON 2026 (28th APTI National
Convention, Raipur, 24–25 Oct 2026), visually consistent with the live website
(`apticon.in`, source at `C:\Users\C839248\apticon-2026`).

No backend, no login, no forms. All content is static data ported from the
website's source and bundled into the app.

## Source of truth

Visual language and content are both taken from `apticon-2026`:

- Brand palette / fonts: `apticon-2026/app/globals.css`
- Event facts: `apticon-2026/lib/constants.ts` (`EVENT`, `STATS`, `SCHEDULE_DAY1`,
  `SCHEDULE_DAY2`, `SESSION_COLORS`, `RAIPUR_PLACES`)
- Committee: `apticon-2026/lib/committee-data.ts` (`NATIONAL_BODY`,
  `STATE_BRANCHES`) plus the extra groups (Patrons, Local Organizing Committee,
  Organizing Secretariat, Registration Committee, Scientific Committee)
  currently inlined in `apticon-2026/app/committee/CommitteeClient.tsx`
- Venue: `apticon-2026/app/venue/VenueClient.tsx` (`TRANSPORT`, `HOTELS`,
  `CUISINE`, map coordinates) + `RAIPUR_PLACES` from constants
- Images: `apticon-2026/public/committee/**`, `apticon-2026/public/cultural/**`,
  `apticon-2026/public/logo/**`

## Decisions (confirmed with user)

1. **Navigation**: 5 bottom tabs — Home, Schedule, Committee, Speakers, Venue.
2. **Scope**: stay focused on these 4 content sections + Home dashboard. No
   About/Sponsors/Registration screens.
3. **Committee UX**: search bar + collapsible accordion for the 28 state
   branches; national-level groups (National Body, Patrons, LOC, Secretariat,
   Registration Committee, Scientific Committee) stay pinned open at the top.
4. **Speakers**: clean "lineup being announced" empty state. No placeholder
   fake-named speaker cards (the website currently shows "To Be Announced"
   cards, but the user chose the simpler honest empty state instead).

## Tech stack

- **Expo Router** (file-based routing, SDK 57). `app/` directory with a
  `(tabs)` group. Replaces the current `App.tsx` single-screen entry.
  - New deps: `expo-router`, `react-native-safe-area-context`,
    `react-native-screens`, `expo-linking`, `expo-constants`.
  - `index.ts` becomes `expo-router/entry` per the current SDK 57 docs.
  - **Before writing any router/font/image code, pull
    `https://docs.expo.dev/versions/v57.0.0/` for the exact current API** —
    per `AGENTS.md` in this repo. Do not rely on older Expo Router patterns
    from training data (e.g. `expo-router/babel` plugin, older config plugin
    shape, etc. — verify against the versioned docs).
- **Fonts**: `@expo-google-fonts/playfair-display`, `@expo-google-fonts/inter`,
  loaded with `expo-font` `useFonts` behind a splash-screen hold
  (`expo-splash-screen`). Mirrors the site's `--font-display` (Playfair) /
  `--font-sans` (Inter).
- **Icons**: `lucide-react-native` (+ its peer `react-native-svg`) — same
  icon set the website uses via `lucide-react`, so glyphs match 1:1
  (MapPin, Plane, Train, Car, Utensils, Mail, User, Download, Search,
  ChevronDown, Home, CalendarDays, Users, Mic).
- **Gradients**: `expo-linear-gradient` for banner/avatar-card backgrounds and
  buttons. No masked gradient *text* on native — headings use solid brand
  colors instead (`--primary-800` / `--accent-500`), which is visually
  equivalent and much simpler than `@react-native-masked-view`.
- No state management, data-fetching, or storage libraries — everything is
  static TypeScript data bundled at build time.

## Design system (`theme/`)

Ported 1:1 from `apticon-2026/app/globals.css`:

```
primary:   900 #1E1B4B  800 #312E81  700 #4338CA  600 #4F46E5
accent:    500 #EA580C  400 #F97316  300 #FB923C  200 #FDBA74
secondary: 900 #0F172A  800 #1E293B  700 #334155
surface:    50 #F8FAFC   100 #F1F5F9  200 #E2E8F0
text:      dark #0F172A  muted #475569  light #F8FAFC
```

`theme/typography.ts`: `display` (Playfair Display, 700/900) for headings,
`sans` (Inter, 400/500/600/700) for body/UI text.

Shared components (`components/ui/`):
- `Badge` — small pill, uppercase tracked label (equivalent of `GoldenBadge`)
- `Card` — white rounded-2xl surface, subtle border + shadow
- `SectionHeading` — Playfair title + optional accent-colored span
- `GradientBanner` — `expo-linear-gradient` strip used behind avatar cards
- `MemberCard` — gradient banner + overlapping circular avatar + name/role/
  institution/email, used by Committee (mirrors the website's `MemberCard`)
- `TypeChip` — small colored pill for session types (keynote/scientific/
  workshop/panel/cultural/break/etc.), colors ported from `SESSION_COLORS`
- `Divider` — thin hairline section separator (simplified `CulturalDivider`)

## Data layer (`data/`)

New static TypeScript modules ported from the website's `lib/`:

- `data/event.ts` — `EVENT` (name, edition, theme, dates, venue, host, stats)
- `data/schedule.ts` — `SCHEDULE_DAY1`, `SCHEDULE_DAY2`, `SESSION_COLORS`
  (color values translated from Tailwind classes to hex/rgba for RN
  StyleSheet use)
- `data/committee.ts` — `NATIONAL_BODY`, `STATE_BRANCHES` (28 states) ported
  from `committee-data.ts`, plus `PATRONS`, `LOCAL_ORGANIZING_COMMITTEE`,
  `ORGANIZING_SECRETARIAT`, `REGISTRATION_COMMITTEE`, `SCIENTIFIC_COMMITTEE`
  (currently inline arrays in `CommitteeClient.tsx`)
- `data/venue.ts` — `TRANSPORT`, `HOTELS`, `CUISINE`, `RAIPUR_PLACES`, venue
  name/address, and the map lat/lng (`21.2514, 81.6296`) for the "Open in
  Maps" deep link

## Images

- **Remote** (`https://aptiindia.org/...`): loaded directly via
  `Image source={{ uri }}` — no copying needed.
- **Local site-relative** (e.g. `/committee/national/deependra-singh.jpg?v=2`,
  `/cultural/CHITRAKOTE.jpg`, `/logo/APTICON_LOGO.png`): copied into
  `assets/committee/`, `assets/venue/`, `assets/brand/` respectively, query
  strings stripped, referenced via `require(...)`.
- App icon (`assets/icon.png`), Android adaptive icon layers, and splash
  (`assets/splash-icon.png`) are replaced with the real APTICON logo/emblem
  (from `apticon-2026/public/logo/APTICON_LOGO.png` /
  `APTICON_EMBLEM.png`), sized per Expo's icon requirements — currently these
  are the unmodified default Expo template assets.

## Screens

### Root layout (`app/_layout.tsx`)
Loads fonts, holds splash until ready, sets light status bar
(`userInterfaceStyle: light` already in `app.json`), wraps in
`SafeAreaProvider`, renders the `(tabs)` group as the only stack entry (no
other routes — no login, no modals needed for this scope).

### Tabs layout (`app/(tabs)/_layout.tsx`)
5 tabs, `lucide-react-native` icons, active = primary-700 (#4338CA), inactive
= muted slate. Tab bar: white background, subtle top border, matches site's
navbar restraint (no heavy chrome).

### Home (`app/(tabs)/index.tsx`)
- Header: APTICON wordmark/logo, "28th Annual National Convention"
- Event name + theme (English + Hindi line), date display, venue line
- Live countdown (days/hours/minutes) to `EVENT.dates.start`
- Stat row: 28th edition · 1500+ delegates · 20+ speakers · 10,000+ network
- 4 quick-nav cards → Schedule / Committee / Speakers / Venue

### Schedule (`app/(tabs)/schedule.tsx`)
- Day 1 / Day 2 segmented toggle (24 Oct / 25 Oct)
- Vertical timeline of session cards: time range, title, hall,
  color-coded `TypeChip` (inaugural/keynote/scientific/workshop/panel/
  cultural/valedictory/break/logistics — colors from `SESSION_COLORS`)
- Legend of session types
- Small venue-reminder card at the bottom

### Committee (`app/(tabs)/committee.tsx`)
- Search input (filters by name / institution / state, case-insensitive,
  across all groups and all state branches)
- Pinned-open sections (rendered as grids of `MemberCard`): National Body,
  Patrons, Local Organizing Committee, Organizing Secretariat, Registration
  Committee, Scientific Committee
- "State APTI Branches" section: 28 collapsible rows (state name + chevron),
  each expands to a grid of `MemberCard`s for that state; when the search box
  has text, matching states auto-expand and non-matching people/states are
  hidden

### Speakers (`app/(tabs)/speakers.tsx`)
Clean empty state: large icon (Mic), "Speakers Being Announced" heading,
one paragraph of supporting copy (same tone as the website: "curating an
outstanding lineup of pharmacy educators and industry leaders"), no fake
placeholder cards.

### Venue (`app/(tabs)/venue.tsx`)
- Venue card: name (Pt. Deendayal Upadhyay Auditorium), address, feature list
  (seating 1000+, breakout halls, AC, parking, accessibility), "Open in Google
  Maps" button (`Linking.openURL` with a `google.com/maps?q=lat,lng` URL —
  no embedded iframe, which isn't a native pattern)
- Nearby hotels list (name, area, distance, star rating)
- How to Reach: 3 cards (Air/Train/Road) with icon, title, bullet details
- Explore Raipur: image grid of `RAIPUR_PLACES` (name, description, photo)
- Local cuisine: small grid of dish name + emoji + description

## Non-goals

- No registration, abstracts, login, or any write/interactive flow.
- No live data fetching — all content is static and bundled; updating content
  later means editing the `data/` files and re-publishing.
- No offline caching concerns beyond what static bundling already gives.
- No tablet-specific layout tuning beyond what RN's flexbox gives for free.

## Testing / validation approach

- `npx tsc --noEmit` for type safety after each major step.
- `expo start` (web + at least one native target reachable via Expo Go or a
  simulator) to visually verify each screen renders, fonts load, images
  resolve (local `require()`s and remote `uri`s), navigation between all 5
  tabs works, search/accordion interaction on Committee works, and the
  "Open in Maps" link fires `Linking.openURL`.
- Manual pass against `apticon.in`'s live pages (Committee, Venue) side by
  side to confirm color/typography/content consistency.
