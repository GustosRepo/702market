# 702Market Media Wiring Plan

Audit goal: identify where the site should use client-managed media before wiring
uploads and image controls into Supabase/Admin.

## Current Media Sources

- `public/assets/site/*` drives the homepage hero, about/story, contact, and socials CTA.
- `public/assets/events/*` drives event hero backgrounds and event list thumbnails by slug convention.
- Root `public/IMG_*.JPG` files are currently used for homepage/about gallery moments.
- `public/assets/merch/*` is reserved, but empty.
- Database columns already exist for `events.hero_image`, `merch_products.image_path`, and `application_images.storage_path`.
- Missing data model: site-wide editable media slots such as homepage hero, gallery photos, SEO image, and contact/social images.

## Recommended Buckets

- `site-assets`: homepage, about, contact, socials, SEO/Open Graph, and reusable gallery images.
- `event-images`: event hero, event thumbnail, optional event gallery.
- `merch-images`: product photos and merch detail images.
- `application-images`: vendor-submitted product/setup photos.

## Public Route Media Opportunities

| Route | Current Media | Add / Wire Next | Admin Owner |
| --- | --- | --- | --- |
| `/` | Hero background, new-location strip, about card, 3-photo gallery | Editable homepage hero, new-location strip, homepage gallery collection, next-event thumbnail, vendor CTA background, merch CTA media | Site media settings + Events |
| `/events` | Event thumbnails by local slug path | Read thumbnail/hero from `events.hero_image`; fallback image; optional past event archive thumbnails | Events admin |
| `/events/[slug]` | Event hero by local slug path | Read `events.hero_image`; add optional event gallery or venue/detail photos | Events admin |
| `/apply` | No real photos | Add soft vendor/sample-products media strip tied to open events | Site media settings |
| `/apply/[eventSlug]` | No real photos | Add event hero side banner; eventually show vendor sample photo guidelines | Events admin + Site media settings |
| `/merch` | Product art uses local slug path; no files yet | Read `merch_products.image_path`; support multiple product shots later | Merch admin |
| `/about` | About story image + gallery | Manage about hero/story/gallery images from admin | Site media settings |
| `/faq` | No photos | Optional small market detail photo band after FAQ intro | Site media settings |
| `/contact` | One sprinkle image | Editable contact/community image and optional map/venue image | Site media settings |
| `/socials` | One CTA image | Add editable social preview/media collage; real social handles | Site media settings |
| `/privacy`, `/terms` | No photos | Keep mostly text-only; optional small branded header background only | Site media settings, low priority |

## Admin Route Media Opportunities

| Admin Area | Add / Wire Next |
| --- | --- |
| Dashboard | Small preview cards for current homepage hero, next event hero, and latest vendor images |
| Events list | Thumbnail column from `events.hero_image` |
| Event create/edit | Upload/change hero image; optional thumbnail; optional gallery list |
| Applications list | Indicator/count for vendor-uploaded product images |
| Application detail | Display submitted product photos from `application_images` |
| Merch list | Thumbnail from `merch_products.image_path` |
| Merch create/edit | Upload/change product image instead of manually typing an image path |
| Future site media settings | Manage named slots: homepage hero, homepage gallery, about gallery, contact image, socials image, SEO image |

## Data Model Gaps

### Events

Already in schema:

- `events.hero_image`

Needs code wiring:

- Include `hero_image` in public and admin event queries.
- Update event create/edit actions to save uploaded storage path.
- Use `hero_image` first, local slug fallback second.

Optional later:

- `event_images` table for event galleries.
- `thumbnail_image` if hero crop and card crop need to differ.

### Merch

Already in schema:

- `merch_products.image_path`

Needs code wiring:

- Public merch should use `product.imagePath` before local slug fallback.
- Admin merch list should show thumbnails.
- Create/edit forms should upload files to `merch-images`.

Optional later:

- Multiple merch images per product.

### Applications

Already in schema:

- `application_images.storage_path`

Needs code wiring:

- Public application form needs 1-5 uploads with size/type restrictions.
- Admin application detail should display images.
- CSV export can include image count or image links.

### Site-Wide Media

Missing schema. Recommended table:

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

## Suggested Build Order

1. Wire existing DB image fields without uploads yet:
   - `events.hero_image`
   - `merch_products.image_path`
   - `application_images` display on admin detail
2. Add Supabase Storage buckets and upload helpers.
3. Add admin upload controls for events and merch.
4. Add public application image uploads.
5. Add `site_media` table and admin page for site-wide media slots.
6. Replace local `siteAssets` photo arrays with database-driven site media.

## Priority Notes

- Highest visual impact: event hero/image wiring, merch product photos, homepage/about gallery settings.
- Highest operational value: application image uploads and admin review display.
- Lowest priority: photos on legal pages.
- Keep manual URL/path fields as a fallback, but admin should prefer upload controls.
