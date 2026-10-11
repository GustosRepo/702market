# MarketElla Admin Security

The admin uses Supabase Auth plus a server-side email allowlist. Access is
checked in the Next.js proxy for early redirects and checked again inside every
admin page/action before service-role database access. The service-role key
must never use a `NEXT_PUBLIC_` prefix.

## Required production setup

- Set `ADMIN_EMAILS` to the exact lowercase email addresses allowed into admin.
- Set `ADMIN_SESSION_SECRET` to at least 32 random characters. Generate one with `openssl rand -base64 48`.
- Keep the default 30-minute idle timeout and 12-hour absolute limit, or configure `ADMIN_IDLE_TIMEOUT_MINUTES` and `ADMIN_MAX_SESSION_HOURS`.
- Create those users manually in Supabase Auth; do not expose a public sign-up flow.
- Disable public user sign-ups in Supabase Auth settings.
- Require email confirmation and use long, unique passwords for admin accounts.
- Enable MFA in Supabase and enroll each owner/admin account before launch.
- Keep leaked-password protection and Supabase Auth rate limits enabled.
- Store `SUPABASE_SERVICE_ROLE_KEY` only in server-side deployment secrets.
- Use HTTPS in production and rotate credentials immediately after suspected exposure.
- Remove former staff from both `ADMIN_EMAILS` and Supabase Auth, then revoke their sessions.

## Implemented application protections

- `/admin/*` is fail-closed when Supabase or `ADMIN_EMAILS` is missing.
- Authenticated users must also match the server-side allowlist.
- Every admin mutation and CSV export calls `requireAdmin()` independently.
- Admin sessions expire after 30 inactive minutes and always expire after 12 hours by default.
- A signed, HTTP-only, same-site cookie enforces both limits in the proxy and server-side authorization checks.
- The browser heartbeat extends activity only while the admin is actively using the dashboard.
- Login errors do not reveal whether an email is on the allowlist.
- Admin pages and exports are private, non-cacheable, and excluded from indexing.
- Browser responses deny framing, MIME sniffing, camera, microphone, and location access.
- Application uploads are private and reviewed through short-lived signed URLs.
- The service-role Supabase client does not persist or refresh browser sessions.

## Verification before launch

1. Confirm a listed admin can sign in and sign out.
2. Confirm an unlisted Supabase user is redirected to `/admin/login`.
3. Confirm a signed-out request cannot load an admin page, invoke an admin action, or download the CSV export.
4. Confirm admin responses include `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`.
5. Confirm no service-role key appears in browser source, network responses, or the deployed client bundle.
6. Confirm removing an email from `ADMIN_EMAILS` blocks its next request, then revoke that user's Supabase sessions.
7. Confirm an idle session redirects to login after the configured timeout and an active session cannot exceed the absolute limit.
