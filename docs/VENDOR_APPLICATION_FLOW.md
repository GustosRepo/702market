# Vendor application flow

## Activate the database changes

Apply these migrations in order before deploying the application code:

1. `supabase/migrations/20261011090000_expand_application_statuses.sql`
2. `supabase/migrations/20261011091000_add_native_vendor_application_flow.sql`
3. `supabase/migrations/20261011110000_add_event_application_notes.sql`
4. `supabase/migrations/20261011130000_frontend_launch_cleanup.sql`
5. `supabase/migrations/20261109120000_add_application_theme_and_instagram.sql`

The theme/Instagram migration must be applied before deploying the new form fields. Both application types now require a theme-fit answer and include an optional, self-reported Instagram-follow checkbox. Answers appear in admin application details and CSV exports. Existing applications show “Not recorded” for these fields.

The second migration adds per-event general and food vendor settings, event-specific vendor options, application metadata, and private upload metadata. It also keeps existing application records and seeds a standard general-vendor option from each event's current application fee.

The third migration adds separate admin-managed notes/rules for general and
food vendors. The launch cleanup migration adds contact and podcast submission
storage, enforces application capacity, updates stored rules to the MarketElla
brand, and hides incomplete sample records.

## Application types and rules

- Edit general agreements under Admin → Events → Edit event → General vendor terms & agreement, then save the event. New events start with the supplied Vendor Terms & Agreement; each event can retain its own edits. Food vendor rules have their separate editor.
- Each event independently enables general vendor applications, food vendor applications, or both.
- Each type has its own active space options, pricing, capacity, and event-specific rules managed in the event admin.
- General vendors review the full vendor terms before submitting.
- Food vendors review the food vendor rules and permit requirements before submitting.
- Applicants must actively acknowledge the displayed rules; acknowledgement and timestamp are saved with the application.
- Vendors provide their own power. The removed electricity-access request is not collected.
- Both rule sets use the `MarketElla` name and include the MarketElla copyright notice.

## Confirmation email

Confirmation email is optional and uses Resend's HTTP API. Configure these server-only environment variables in the deployment:

```text
RESEND_API_KEY=re_...
APPLICATION_FROM_EMAIL=MarketElla <applications@your-verified-domain.com>
```

An application remains successfully submitted if email is not configured or delivery fails.

## Upload limits

- All document and photo uploads are optional for both general and food applications. Applicants can continue and submit with no files; provided files still follow the limits below.
- Website, social handle, and City of Las Vegas business license number are optional. Price range and special setup requests are no longer collected.
- Allowed types: JPG, PNG, WebP, and PDF
- Maximum per file: 10 MB
- Maximum files: 12
- Maximum combined upload size: 45 MB

Uploads live in the private `application-images` bucket. Admin detail pages create signed URLs that expire after 15 minutes.
