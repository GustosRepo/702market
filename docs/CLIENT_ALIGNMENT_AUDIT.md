# Client Alignment Audit: MarketElla / 1042 Flea Direction

Last updated: October 11, 2026

This document captures the client reference direction from `Homepage.pdf` and
the 1042 Flea inspiration site. Notes in the PDF are client feedback/reference
material, not implementation instructions that override the project scope.

## Alignment Summary

Initial frontend alignment before the first MarketElla pass was approximately
45%. The completed frontend pass now follows the approved MarketElla structure,
voice, palette, photography, and reusable page system.

Implementation note: the first homepage pass added MarketElla hero copy, the
brighter client palette, marquee text, butterflies, locations, story content,
homepage Q&A, social links, and podcast teaser.

The current implementation follows the final five-section homepage structure,
uses the confirmed `MarketElla` name, and carries the orange, pink, coral,
cream, and black system across every public route. Shared contact, navigation,
footer, marquee, admin, and application components keep those pages aligned.
Verified social and press destinations replace generic links, and the owner,
FAQ, podcast, calendar, merch, and application experiences are admin-backed.

Site-wide alignment note: public pages beyond the homepage have also been
updated to match the MarketElla direction, including route metadata, page hero
copy, public shared header/footer labels, event/application/FAQ/social/merch
language, and a CSS alignment layer for inner-page typography, cards, colors,
and section treatments.

Admin/content note (November 8, 2026): the announcement after the hero is now
an automatic next-event countdown. `/admin/homepage` controls visibility, heading,
and the empty-state message using `site_content` key `home.countdown`.
`/admin/events` controls its event title, date, Las Vegas start/end times, and
location. Only published, unarchived events with upcoming status are eligible;
cancelled, completed, and ended events are excluded. At start time it shows
zero and “It's market time!” until the event ends, then advances to the next
scheduled event or shows the empty message. Countdown box: `#FDD0CC`; text:
`#FC574F`. The old announcement fields and unused Media slot have been removed
from the UI; historical database rows and uploaded images are retained.

Apply `20261108120000_replace_home_location_with_countdown.sql` with the release.
It preserves the previous visibility setting and allows visitors to read the
countdown's disabled setting, fixing the old visible-default fallback issue.
Existing event create/edit/publish/archive actions already revalidate `/`.

The section after the countdown is now a photo carousel instead of two event
panels. `/admin/media` → Homepage carousel manages existing `home.gallery.*`
photos and accepts multiple additional uploads. Photos support ordering,
captions, alt text, and visibility. Photos enlarge without a framed viewer or
visible toolbar. The gallery background is `#FDD0CC`; arrow keys and mobile
swipes navigate enlarged photos, while clicking or Escape closes them and
restores focus. Calendar navigation points to
`/events`; it no longer anchors to the retired panels. This gallery change uses
the existing media schema and storage bucket.
The carousel advances every five seconds and loops. Hover, touch, focus,
enlargement, reduced motion, the global motion pause control, and background or
offscreen viewing pause automatic movement. Enlarged images only change manually.

Latest visual QA confirmed flat white 2D butterflies, a side-by-side contact
layout whose display heading stays inside its column, and a wrapping shared
navigation with no document overflow at true 390px and 320px viewports.

## Client Direction Observed

- Rebrand homepage language from 702Market toward MarketElla.
- Use the 1042 Flea page as a close visual/content reference.
- Full-bleed photo hero with huge all-caps welcome text.
- Add moving or still butterflies throughout.
- Use same/similar font treatment and all-caps display text.
- Use rotating/marquee phrases such as "not your average market."
- Use ombre backgrounds across multiple sections.
- Repeat phrases intentionally, similar to 1042 Flea.
- Add social links for Instagram, Facebook, and TikTok.
- Add a podcast area for "702 chisme."
- Add locations with image cards, short captions, map links, and calendar links.
- Show an automatic next-event countdown directly after the hero (replaces the
  earlier new-location announcement).
- Add a larger FAQ/Q&A section with plus-sign accordions.
- Keep the logo direction similar to the current/old 702 logo and base the site
  around that treatment.

## Color Direction From Last PDF Page

The final page shows the clearest palette direction:

- Bright orange: approximately `#ff7a2f`
- Hot pink: approximately `#ff2f73`
- Coral red: approximately `#ff514f`
- White/off-white: approximately `#fbfaf8`
- Black: used as a strong grounding/background color behind the logo area
- Ombre blends: pink, orange, coral, and soft white/pale-pink gradients

Previous CSS partially aligned with this palette:

- `--pink: #ff6f9f`
- `--peach: #ff8b73`
- `--sun: #ffbd58`
- `--cream: #fff9f1`

Recommended palette adjustment:

- Increase saturation and contrast toward the final PDF page.
- Add black as a first-class brand color for footer/logo/high-contrast sections.
- Reduce the softer plum/berry dominance on the homepage if the client wants the
  brighter MarketElla template feel.
- Keep accessibility checks for white text over ombre/photo backgrounds.

Implementation note: the active CSS tokens now use the brighter approximate
palette above.

## Original Gaps

### Homepage Structure

Original homepage sections before the MarketElla pass:

- Hero
- Next market
- About
- Gallery
- Vendor CTA
- Merch CTA
- Footer

Client PDF expected a longer homepage:

- Hero with MarketElla welcome text
- Rotating phrase band
- Upcoming market / next market section
- Apply-to-sell section
- Press or "same wording" section inspired by 1042 Flea
- Social link section
- Locations section
- About / "what is MarketElla?" story section
- What makes MarketElla different section
- Meet the owners
- Map/calendar section
- Contact/questions section
- FAQ/Q&A section
- Podcast section

### Tone

The implemented copy uses the requested casual, blunt, founder-led, and
intentionally messy/cute voice. Examples from the PDF include:

- "what the f**** is marketella????"
- "girl, YES."
- "a little chaotic. in a cute way."
- "cute shit."

Confirm the final profanity level with the client before launch.

### Motion

Originally missing, now implemented:

- Moving or still butterflies
- Rotating text/marquee bands
- Repeated phrase loops
- More collage/sticker-like layering

### Navigation

Original nav before the alignment pass:

- Next market
- About
- Merch
- Socials
- Apply to sell

Implemented PDF/reference nav direction:

- Apply 2 Sell
- What is 1042? / What's MarketElla?
- Online Store
- Calendar
- FAQ
- Link Tree
- Podcast

## Recommended Implementation Priority

Status: implemented and validated. Remaining launch dependencies are the
client-owned production domain, Resend credentials/verified sender, final merch
inventory, and any new podcast episodes the owners want to publish.

1. Rebrand homepage copy and nav to MarketElla while preserving existing route
   functionality.
2. Update CSS tokens to match the final PDF color palette more closely.
3. Rebuild homepage hero with full-bleed photo, huge all-caps welcome text, and
   butterfly/marquee accents.
4. Add a reusable marquee/rotating-text component.
5. Add homepage sections for locations, about/story, map/calendar, FAQ, socials,
   and podcast.
6. Keep existing separate pages for SEO and workflow depth, but make the
   homepage feel like the primary 1042-inspired long-scroll experience.
7. Run mobile/desktop visual QA with special attention to text overlap on photo
   backgrounds.

## Product Note

The implemented direction treats 1042 Flea and the client deck as structural
and tonal references while keeping MarketElla's own palette, content,
photography, routes, and reusable components. It is not an exact visual copy.
