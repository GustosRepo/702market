# MarketElla Media Wiring Status

Core media wiring and upload controls are implemented. This document now tracks
the current ownership model and the small set of optional launch additions.

## Current Media Sources

- `site_media` drives editable homepage, about, contact, and socials media with optimized local WebP fallbacks in `public/assets/site/*`.
- `events.hero_image` drives event heroes and list thumbnails with local slug fallbacks in `public/assets/events/*`.
- Homepage and about gallery slots are editable from `/admin/media`.
- The homepage photo carousel replaces the two event panels below the countdown.
  The section background is `#FDD0CC`. Clicking a photo enlarges just the image
  over a soft backdrop. Arrow keys and mobile swipes navigate; clicking the
  image/backdrop or pressing Escape closes it. The carousel retains its arrows.
  It advances every five seconds and loops to the beginning, pausing on hover,
  touch, keyboard focus, or photo enlargement. Reduced motion and the existing
  Pause animations control in the footer also stop auto-sliding; hidden/offscreen galleries wait.
- In `/admin/media` → Homepage carousel, upload multiple new photos, replace
  existing photos, set alt text/captions/display order, and toggle Active.
  Storage uses `site-assets` and existing `home.gallery.*` rows; no additional
  schema is needed. Hidden photos stay hidden even when all photos are disabled.
- `public/assets/merch/*` is reserved, but empty.
- `merch_products.image_path` supports uploaded product imagery.
- `application_images.storage_path` stores private vendor uploads and admin pages generate temporary signed links.
- The remaining site-media gap is an optional dedicated SEO/Open Graph image slot.
- Homepage press cards use article titles, destinations, and preview paths in
  `src/lib/site-config.ts`. Influence.Vegas and Fox 5 previews are stored locally
  in `public/assets/press/` from the linked articles' published preview images.
  Channel 8 uses an existing MarketElla photo because its preview blocks access.
  Cards show a thumbnail, outlet, headline, and pill CTA in the site palette.

## Recommended Buckets

- `site-assets`: homepage, about, contact, socials, SEO/Open Graph, and reusable gallery images.
- `event-images`: event hero, event thumbnail, optional event gallery.
- `merch-images`: product photos and merch detail images.
- `application-images`: vendor-submitted product/setup photos.

## Public Route Media Opportunities

| Route | Current Media | Remaining Opportunity | Admin Owner |
| --- | --- | --- | --- |
| `/` | Editable hero, automatic countdown, and photo carousel with popup viewer | Optional additional campaign slots | Site media settings + Events |
| `/events` | Database event thumbnails with local fallbacks | Optional archive-specific crops | Events admin |
| `/events/[slug]` | Database event hero with local fallback | Optional event gallery or venue/detail photos | Events admin |
| `/apply` | Full-photo branded hero | Optional vendor/sample-products strip | Site media settings |
| `/events/[slug]/apply` | Event context and application uploads | Optional event-specific application banner | Events admin + Site media settings |
| `/merch` | Uploaded product image with local fallback support | Multiple product shots later | Merch admin |
| `/about` | Editable hero/story/gallery imagery | Final owner and family photography | Site media settings |
| `/faq` | No photos | Optional small market detail photo band after FAQ intro | Site media settings |
| `/contact` | One sprinkle image | Editable contact/community image and optional map/venue image | Site media settings |
| `/socials` | One CTA image | Add editable social preview/media collage; real social handles | Site media settings |
| `/privacy`, `/terms` | No photos | Keep mostly text-only; optional small branded header background only | Site media settings, low priority |

## Admin Route Media Opportunities

| Admin Area | Current Status / Next |
| --- | --- |
| Dashboard | Small preview cards for current homepage hero, next event hero, and latest vendor images |
| Events list | Implemented thumbnail from `events.hero_image` |
| Event create/edit | Implemented hero upload/change; optional gallery remains |
| Applications list | Implemented upload indicator/count |
| Application detail | Implemented private signed links for submitted files |
| Merch list | Implemented thumbnail from `merch_products.image_path` |
| Merch create/edit | Implemented product image upload/change |
| Site media settings | Implemented named slots; SEO image slot remains optional |

## Data Model Gaps

### Events

Implemented: `events.hero_image` is included in public/admin queries, event
create/edit supports uploads, and public pages use the database image before a
local slug fallback.

Optional later:

- `event_images` table for event galleries.
- `thumbnail_image` if hero crop and card crop need to differ.

### Merch

Implemented: public merch reads `merch_products.image_path`, admin lists show
thumbnails, and create/edit forms upload to `merch-images`. Final product
inventory and photography are client launch content.

Optional later:

- Multiple merch images per product.

### Applications

Implemented: public applications validate and upload required files to the
private `application-images` bucket, admin detail pages expose signed links,
and CSV exports include upload metadata.

### Site-Wide Media

Implemented schema:

- `site_media`
- Columns: `slot`, `storage_path`, `alt_text`, `caption`, `sort_order`, `active`, `created_at`, `updated_at`.
- Example slots: `home.hero`, `home.gallery`, `about.gallery`, `contact.community`, `socials.cta`, `seo.og`.

### Homepage Copy

Added schema:

- `site_content`
- Columns: `key`, `content`, `active`, `created_at`, `updated_at`.
- Current key: `home.countdown`.
- Editable fields: heading, empty-state message, and active status at `/admin/homepage`.
- The date, start/end times, title, and location come from published events in
  `/admin/events`, using America/Los_Angeles time.
- The retired announcement image slot is no longer shown in Admin Media.
- Release migration: `20261108120000_replace_home_location_with_countdown.sql`.

## Implementation Status

1. [x] Wire event, merch, application, and site-wide media fields.
2. [x] Add Supabase Storage buckets and upload helpers.
3. [x] Add admin upload controls for events, merch, and named site slots.
4. [x] Add validated private application uploads and admin review links.
5. [x] Use database-managed site media with optimized local fallbacks.
6. [ ] Add an optional dedicated SEO/Open Graph image slot and admin control.

## Priority Notes

- Highest visual impact: event hero/image wiring, merch product photos, homepage/about gallery settings.
- Highest operational value: application image uploads and admin review display.
- Lowest priority: photos on legal pages.
- Keep manual URL/path fields as a fallback, but admin should prefer upload controls.
