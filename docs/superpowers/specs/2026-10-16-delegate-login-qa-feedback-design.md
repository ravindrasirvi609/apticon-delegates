# Delegate Login, Session Q&A and Feedback — Design Spec

Date: 2026-10-16
Status: Draft for review (supersedes "no backend, no login, no forms" in
`2026-09-12-apticon-delegate-app-design.md` — that scope is now extended)

## Goal

Let a registered delegate log in to the delegate app, then — per conference
session — ask questions (and upvote others') and leave feedback. Browsing
(schedule, committee, speakers, venue) stays public and login-free.

## Confirmed decisions

1. **Backend**: reuse the existing `apticon-2026` backend (Next.js App Router +
   MongoDB/Mongoose on Vercel, `https://apticon-2026.vercel.app/api/mobile`),
   the same one the staff app uses. New code lives in the `apticon-2026` repo.
2. **Login**: registration QR (or its text) + the registration email.
3. **Who can log in**: only registrations with `status === "approved"`.
4. **Questions (v1 scope, confirmed 2026-10-16)**: a delegate can *submit* a
   question for a session from their app, only after that session has started.
   **Where/how questions are displayed (public question list, upvotes,
   organizer/moderation screen) is deliberately deferred — ignore for now.**
   v1 just stores questions (status `pending`) and lets the delegate see their
   own submitted questions. Display/moderation will be designed later.

## Facts about the existing backend (verified in `apticon-2026`)

- QR payload is the plain `registrationCode` string (`lib/qrcode.ts`,
  `MOBILE_API.md` §10). Codes look like `AM1001`, `AA501`, or legacy
  `APT-REG-2026-XXXXXX` — **sequential and guessable**.
- `Registration.email` is stored lowercase+trimmed; `registrationCode` is a
  sparse unique index; `status` is one of `submitted | payment_review |
  approved | rejected | resubmitted`.
- Mobile responses use the envelope `{ success, message, data | errors }`
  (`lib/mobile/response.ts`: `ok`, `fail`, `failFromError`).
- JWT = HS256 via `jose`, 7 days (`lib/auth.ts`). `verifySession` returns `null`
  for any role outside its known union, so a delegate token can never pass
  `requireStaff` or the web session check as long as the role is not added to
  that union.
- `lib/rate-limit.ts` is **in-memory per serverless instance** — not reliable
  on Vercel for brute-force protection of guessable codes.
- `apticon-2026/AGENTS.md`: Next.js there has breaking changes — read
  `node_modules/next/dist/docs/` before writing any backend route.

## Login flow

```
App → get registrationCode via one of:
        a) live camera scan (CameraView, barcodeTypes ["qr"])
        b) pick image from gallery/screenshot → Camera.scanFromURLAsync(uri, ["qr"])
        c) type the code manually (fallback)
    → delegate enters email
    → POST /api/mobile/delegate/auth/login { registrationCode, email }
    → server: find Registration by code; email matches (case-insensitive);
      status === "approved"
    → returns { token, delegate: { id, name, registrationCode, institution } }
    → app stores token in expo-secure-store
```

The scanned/uploaded QR text must match the code pattern before sending;
whitespace is trimmed and the code upper-cased client-side.

### Security (must-haves, because code + email are not secrets)

1. **DB-backed lockout**, not the in-memory limiter: new collection
   `DelegateLoginAttempt { key (code), failures, lockedUntil }` with a TTL
   index. 5 failures on a code → locked 15 min. Additionally keep the existing
   per-IP `rateLimit` as a cheap first layer.
2. **Generic failure message** — always `401 "Invalid details"`; never reveal
   whether the code exists, the email mismatched, or the status was not
   approved. (Approved-only is enforced server-side, but the message for a
   non-approved registrant can be a separate, friendlier `403` *only after*
   code+email both match, since at that point the caller already knows both.)
3. **Separate token**: sign delegate JWTs with their own secret
   (`DELEGATE_TOKEN_SECRET`) and claim `aud: "delegate"`; verify with a new
   `requireDelegate(req)` helper in `lib/mobile/delegate-auth.ts`. Staff
   verification is untouched.
4. Delegate endpoints only ever read/write the caller's own data (uid comes
   from the token, never from the body).
5. Audit-log failed and successful logins via existing `logAudit`.
6. Later upgrade path if needed: email OTP via Resend (already configured).

## Backend additions (`apticon-2026`, new collections only)

`Registration`, payment and staff collections are **not modified**.

Models (`models/`):

- `DelegateQuestion` — `sessionId` (string), `registrationId`, `text` (≤500),
  `isAnonymous`, `status: pending | approved | answered | hidden`,
  `voteCount`, timestamps. Index `{ sessionId, status, voteCount: -1 }`.
- `DelegateQuestionVote` — `questionId`, `registrationId`; unique compound
  index (one vote per delegate per question).
- `DelegateFeedback` — `sessionId`, `registrationId`, `rating` (1–5),
  `comment` (≤1000, optional); unique `{ sessionId, registrationId }` (upsert).
- `DelegateLoginAttempt` — see Security (TTL).

Endpoints under `/api/mobile/delegate/` (same envelope as the staff API):

| Method | Path | Purpose |
|---|---|---|
| POST | `auth/login` | code + email → token |
| GET | `auth/me` | validate token / profile |
| GET | `sessions/{sessionId}/questions` | **v1: caller's own questions only.** (Public list + `hasVoted` deferred) |
| POST | `sessions/{sessionId}/questions` | ask — only after session start (rate-limited per delegate, e.g. 5/session) |
| POST | `questions/{id}/vote` | **Deferred** (needs the public list) |
| PUT | `sessions/{sessionId}/feedback` | create/update my feedback |
| GET | `sessions/{sessionId}/feedback` | my feedback (or null) |

`sessionId` validation: must match `^d[12]-\d{2}$`-style ids defined in
`schedule.json` (see below); server holds the list of valid ids + start/end
times (small JSON in the backend repo) so it can enforce:
- Q&A allowed from session start until `end + 30 min` (configurable).
- Feedback allowed from session start; edits allowed until end of day 2.
- No Q&A/feedback on `break`/`logistics` sessions.

Moderation / display of questions: **deferred.** Until designed, organizers can
read submitted questions directly in MongoDB Atlas. (Later option: a
"Questions" page in the web admin console, `components/console`.)

## App changes (`apticon-delegates`)

New deps (use `npx expo install`): `expo-secure-store`, `expo-camera`,
`expo-image-picker`. Add `expo-camera` (with `cameraPermission`) and
`expo-secure-store` to `app.json` plugins. API names confirmed against SDK 57
docs: `CameraView` `onBarcodeScanned` + `barcodeScannerSettings`,
`Camera.scanFromURLAsync(url, ["qr"])`, SecureStore `get/set/deleteItemAsync`,
`Stack.Protected` with a session context + `SplashScreen` hold.

```
src/
  app/
    _layout.tsx              wrap in SessionProvider; keep splash until loaded
    (tabs)/me.tsx            profile, logout (shows "Log in" if guest)
    login.tsx                scan / upload / type code + email   (modal route)
    session/[id].tsx         tabs: Details | Q&A | Feedback
  services/
    api.ts                   fetch wrapper (Bearer, envelope, 401 → sign out)
    delegate-auth.ts         login, me
    delegate-qa.ts           questions, vote, feedback
  hooks/use-session.tsx      SessionProvider + useSession (token in SecureStore)
  screens/session/           question-list, ask-sheet, question-card,
                             feedback-form, star-rating
```

- Guard only the *actions*: Q&A/Feedback tabs show a "Log in to ask / give
  feedback" `EmptyState` + `Button` for guests; no global login wall.
- `schedule.json` sessions get a stable `id` (e.g. `d1-03`); update
  `src/types/remote-content.ts`, `src/data/schedule.ts` defaults,
  `src/utils/remote-validators.ts` (+ tests) and `remote-data/README.md`.
  Session card becomes tappable → `session/[id]`.
- Reuse existing `Card`, `Button`, `Badge`, `EmptyState`, `PressableScale`,
  theme tokens. Follow existing test style (jest-expo) for services/validators.
- A 401 from any delegate call clears the token and returns to guest state.
- Network failures: inline error + retry; submitted text is kept in the input.

## Out of scope (v1)

Push notifications, offline queue, speaker/answer replies in-app (organizer
marks "answered"; answer text is spoken live), editing/deleting own questions
after approval, web admin analytics beyond a simple average-rating view.

## Store-review notes

- Provide a demo delegate (code + email) in App Review notes.
- User-generated content ⇒ include a "Report" action on questions, and
  organizer moderation (above). Accounts are not created in-app, so in-app
  account deletion is not applicable.

## Build order

1. Backend: delegate auth (`requireDelegate`, login, lockout, `me`) + tests via
   cURL; add `DELEGATE_TOKEN_SECRET` to Vercel env.
2. App: SessionProvider, login screen (scan / upload / manual), Me tab.
3. Session ids in `schedule.json` + validators + session detail shell.
4. Backend + app: Feedback.
5. Backend + app: ask a question (only after session start) + "my questions".
6. Polish, tests, demo account, internal build, load check before the event
   (24–25 Oct 2026).
7. *(Deferred)* question display, upvotes, report, moderation/admin page.

## Open items

- Where/how questions are shown to others and to organizers (deferred).
- Exact Q&A cut-off after a session ends (default: end + 30 min) and feedback
  window.
