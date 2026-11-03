# Codel

A daily JavaScript debugging game: fix three short programs, run them against expected console output, and compare completion times. Built with Next.js, React, and Firebase.

## Three ways to use it

1. **A short debugging practice session.** Run your own instance and fix the easy, medium, and hard examples. Hints and expected output give immediate feedback. The bundled fallback set repeats until you publish dated puzzles; it is not a fresh daily feed by itself.
2. **A classroom or club warm-up.** Put an approved three-puzzle set on screen, let people explain the bug before running it, and compare approaches. Your Firebase project can retain signed-in players' history and leaderboard entries. Guest play is available, but the example rules intentionally do not persist unauthenticated scores.
3. **Author and review your own puzzle calendar.** Sign in as your configured administrator, open `/admin`, and generate or revise a dated set with Claude. Review the JSON and solve each puzzle before approving it. Generation is optional, requires your own API key, and consumes paid provider usage.

## Local setup

Use Node.js 22.13+ and npm. Create a separate Firebase project for your own instance; this checkout contains no default live backend.

```sh
git clone https://github.com/MikWess/codel.git
cd codel
npm ci
cp .env.example .env.local
```

1. In Firebase, register a Web app and copy its configuration into the six `NEXT_PUBLIC_FIREBASE_*` variables. These are browser-visible project identifiers; never put service-account credentials in a `NEXT_PUBLIC_*` variable.
2. Enable **Authentication → Google** and add your local hostname to the authorized domains. Create a Firestore database.
3. Adapt `firestore.rules.example`, replacing the administrator email, and apply it to **your** project. It allows public reads of approved puzzles and leaderboard records, signed-in score creation, and admin-only puzzle writes. Display names, avatars, and scores are therefore public in this example.
4. Set `NEXT_PUBLIC_ADMIN_EMAIL` to your administrator's Google email if you want the admin UI. Restart the server after changing public environment variables.

```sh
npm run dev
```

Open **http://localhost:3000**. Missing Firebase configuration produces a setup screen rather than silently connecting to the author's backend. With no approved set for today, the game uses the bundled puzzles.

## Optional puzzle generation

Set these server-only variables in `.env.local`:

- `ADMIN_EMAIL`: the verified Google email allowed to use paid generation/chat routes.
- `FIREBASE_PROJECT_ID`: the same project as the browser configuration.
- `GOOGLE_APPLICATION_CREDENTIALS`: an absolute path to your local Firebase service-account JSON (outside the repository), or use application-default credentials in your hosting environment.
- `ANTHROPIC_API_KEY`: your own provider key.

The browser sends its Firebase ID token with admin requests. The server checks that token, revocation status, verified email, and the configured admin email before calling Anthropic. Client-side visibility alone does not authorize those routes. Firestore rules still need their own matching administrator configuration because puzzle saves happen from the browser.

There is no public `/api/seed` endpoint. Populate your own data through the admin workflow. Review every generated puzzle's expected output and difficulty before approving it.

## Troubleshooting and boundaries

- **Missing or insufficient permissions:** confirm sign-in, the selected Firebase project, and rules. Keep drafts private; do not enable unrestricted writes to work around an error.
- **Firestore index required:** use the index link Firestore returns for your project's query. Queries and collections are in `src/lib/db.ts` (`puzzles` and `games`).
- **401/403 on admin API:** reauthenticate and check verified email plus the server-side `ADMIN_EMAIL`. **503** means the admin email is not configured. Invalid server credentials can also cause token verification to fail.
- **No new puzzle today:** approve a set for today's UTC date, or use the repeating bundled fallback.

This is a practice-game prototype. Browser-submitted times are not independently verified or cheat-resistant. The Web Worker runner limits execution time, but is not a security sandbox for hostile programs. Keep the app's puzzles small and trusted. The example database rules are a starting point, not a full production abuse-control design.

## Development

```sh
npm test       # no Firebase or model calls
npm run lint
npm run build
```

The authorization regression checks cover absent tokens, non-admin identities, unverified email, invalid tokens, and missing configuration. Builds can run without Firebase or model credentials; they do not prove live authentication, database rules, or provider generation works.

`src/lib/puzzles.ts` holds fallback puzzles, `src/lib/runner.ts` runs submitted code, `src/lib/db.ts` contains database queries, and `src/app/api/` contains the guarded model routes. Read `AGENTS.md` and the installed Next.js guides before framework changes.
