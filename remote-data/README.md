# remote-data/

This folder is the app's "CMS." Editing a file here updates the live app's
content **without an app-store release and without an EAS Update** — the app
fetches these files at runtime, falling back to its bundled defaults if a
fetch fails or a file is malformed.

## How to edit

1. Open the file on github.com (e.g. `remote-data/event.json`) and click the
   pencil "Edit this file" icon — no local clone needed — or edit it with git
   and push to `main` as usual.
2. Keep the exact same JSON shape (same keys, same nesting). If a required
   field is missing, badly typed, or an array is empty where one is required,
   the app will silently ignore your edit and keep showing the previous
   content for that whole file (see "Validation" below) — it will not crash,
   but it also won't show your change until it's fixed.
3. Commit directly to `main`.

## How the app picks it up

The app fetches these files from
`https://raw.githubusercontent.com/ravindrasirvi609/apticon-delegates/main/remote-data/<file>.json`
on each cold start (app launch) and silently swaps in new content if valid.
There is no in-app refresh button and no persistent cache in this version —
every cold start re-fetches.

**raw.githubusercontent.com caches each file for about 5 minutes** at
GitHub's edge, with no manual purge step required. In practice: push your
change, wait up to ~5 minutes, then relaunch the app (or wait for a
delegate's next cold start) to see it live.

### Why raw.githubusercontent.com, not jsdelivr

jsdelivr's `@main`-branch CDN URL
(`https://cdn.jsdelivr.net/gh/ravindrasirvi609/apticon-delegates@main/...`)
is cached far more aggressively — an update to a branch tag can take up to
24 hours to reach every edge node unless you manually hit their purge
endpoint (`https://purge.jsdelivr.net/gh/ravindrasirvi609/apticon-delegates@main/remote-data/<file>.json`)
right after every push. Since the whole point of this system is "edit and
have it basically just work," raw.githubusercontent.com's ~5-minute,
no-purge-needed cache is the better default. If you ever need to switch
(e.g. GitHub's raw CDN becomes a bottleneck), it's a single constant to
change: `REMOTE_BASE_URL` in `src/services/remote-data.ts` — just remember
to hit the purge URL after each push if you do.

## Validation (what makes an edit "take")

Each file is validated as a whole before being shown — there is no partial
field recovery. A few examples of edits that will be silently rejected
(previous content stays visible until fixed):

- Renaming a key, or changing a string field to a number (or vice versa).
- Deleting a required field from an object (e.g. a committee member's
  `name`, a schedule session's `time`).
- Setting a schedule session's `type` to something other than: `inaugural`,
  `keynote`, `scientific`, `workshop`, `panel`, `cultural`, `valedictory`,
  `break`, `logistics`.
- Setting a transport option's `icon` to something other than `plane`,
  `train`, `car`.
- Leaving `day1`, `day2`, `transport`, `hotels`, or `raipurPlaces` as an
  empty array (these must have at least one entry); `cuisine` may be empty.
- Making `event.startDate` not a parseable ISO date string.

Fields that ARE optional and safe to omit per committee member: `role`,
`designation`, `institution`, `email`, `image`.

## Images

Committee member and Raipur-places photos are plain URL strings in these
JSON files. Most already point at `aptiindia.org`; the rest point at files
already committed to this repo under `assets/committee/` and `assets/venue/`
via their raw GitHub URL — if you replace one of those asset files (same
filename) and push, its JSON reference keeps working with the new photo.
