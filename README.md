This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and, for local
development, in `.env.local` (git-ignored).

| Variable | Exposed to browser | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public anon key. Used for reads only. |
| `SUPABASE_SERVICE_ROLE_KEY` | **no** | Service-role key from Supabase → Project Settings → API. Used only by the admin API to write content. |
| `ADMIN_PASSWORD` | **no** | Password for `/admin-supabase`. |
| `ADMIN_SESSION_SECRET` | **no** | Random string of at least 32 characters that signs the admin session cookie. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. |

Never prefix the last three with `NEXT_PUBLIC_`, or they will be shipped to every visitor.

## Admin authentication

`/admin-supabase` logs in through `POST /api/admin/auth`. On the right password
the server sets an `admin_session` cookie: `httpOnly`, `Secure`,
`SameSite=Strict`, scoped to `/api/admin`, valid for 8 hours. The cookie holds an
expiry time and an HMAC-SHA256 signature made with `ADMIN_SESSION_SECRET`.

Every handler under `src/app/api/admin/` (other than the login route) calls
`requireAdmin()` from `src/lib/adminSession.ts` first and returns `401` without
a valid cookie. When the admin page gets a `401` it shows the login screen again
and keeps unsaved edits.

- **Log everyone out:** change `ADMIN_SESSION_SECRET` or `ADMIN_PASSWORD` and redeploy.
- **New admin route:** start the handler with
  `const denied = requireAdmin(request); if (denied) return denied;`.

The API check only matters if the database also refuses writes from the public
anon key. Once `SUPABASE_SERVICE_ROLE_KEY` is set and deployed, run
[`supabase/lock-down-rls.sql`](supabase/lock-down-rls.sql) in the Supabase SQL
Editor so the anon key can only read. After that,
`scripts/migrate-to-supabase.js` (which writes with the anon key) needs the
service-role key to run.

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
