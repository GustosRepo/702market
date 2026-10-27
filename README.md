This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## End-to-end tests

The [Playwright](https://playwright.dev/docs/intro) suite runs against a production
build on desktop Chromium and mobile Chromium (Pixel 7).

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

Playwright starts the app at `http://127.0.0.1:3100` and a local Supabase HTTP
fixture at `http://127.0.0.1:54329`. Both ports must be free. No running dev server,
Supabase project, credentials, database migrations, or email service is needed.
The test process overrides app credentials, disables outgoing confirmation emails,
and builds into `.next/e2e` so it does not replace the normal app build.
Existing `.env.local` values are not used for these services.

```bash
npm run test:e2e -- --project=chromium        # Desktop only
npm run test:e2e -- tests/e2e/applications.spec.ts
npm run test:e2e:ui                         # Interactive runner
npm run test:e2e:report                     # Last HTML report
```

Coverage includes public navigation, FAQ, legal pages, shop and podcast links,
calendar downloads, open/closed applications, general and food vendor submissions,
file uploads, validation, upload rollback and retry, contact and podcast submissions,
and anonymous admin protection plus invalid login. Failures retain screenshots and
traces under `test-results/`; the HTML report is under `playwright-report/`.
GitHub Actions runs the suite for pull requests and pushes to `main`/`master`
and uploads these artifacts.

Tests exercise the actual Next.js pages, server actions, and Supabase SDK against
`tests/e2e/support/supabase-server.mjs`. The fixture supplies dates relative to today
and captures writes; unique test identities isolate parallel runs and retries.
Extend `support/data.mjs` for new content and add explicit fixture handlers for new
service requests. Unknown requests fail rather than silently succeeding.
This suite does not verify real Supabase schema/RLS, real email delivery, or
authenticated admin workflows; those require a separate disposable integration
environment.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
