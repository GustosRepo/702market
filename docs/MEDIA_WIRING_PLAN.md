# MarketElla Media Wiring Status

Core media wiring and upload controls are implemented. This document now tracks
the current ownership model and the small set of optional launch additions.

## Current Media Sources

- `site_media` drives editable homepage, about, contact, and socials media with optimized local WebP fallbacks in `public/assets/site/*`.
- `events.hero_image` drives event heroes and list thumbnails with local slug fallbacks in `public/assets/events/*`.
- Homepage and about gallery slots are editable from `/admin/media`.
- `public/assets/merch/*` is reserved, but empty.
- `merch_products.image_path` supports uploaded product imagery.
- `application_images.storage_path` stores private vendor uploads and admin pages generate temporary signed links.
- The remaining site-media gap is an optional dedicated SEO/Open Graph image slot.

## Recommended Buckets

- `site-assets`: homepage, about, contact, socials, SEO/Open Graph, and reusable gallery images.
- `event-images`: event hero, event thumbnail, optional event gallery.
- `merch-images`: product photos and merch detail images.
- `application-images`: vendor-submitted product/setup photos.

## Public Route Media Opportunities

| Route | Current Media | Remaining Opportunity | Admin Owner |
| --- | --- | --- | --- |
| `/` | Editable hero, new-location strip, and event photography | Optional additional campaign slots | Site media settings + Events |
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
- Example slots: `home.hero`, `home.new_location.strip`, `home.gallery`, `about.gallery`, `contact.community`, `socials.cta`, `seo.og`.

### Homepage Copy

Added schema:

- `site_content`
- Columns: `key`, `content`, `active`, `created_at`, `updated_at`.
- Current key: `home.new_location`.
- Editable fields: top rotating phrases, heading label, location name,
  description, CTA label/link, bottom rotating phrases, and active status.

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
