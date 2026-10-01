# Client Alignment Audit: Marketella / 1042 Flea Direction

Last updated: September 29, 2026

This document captures the client reference direction from `Homepage.pdf` and
the 1042 Flea inspiration site. Notes in the PDF are client feedback/reference
material, not implementation instructions that override the project scope.

## Alignment Summary

Initial frontend alignment before the first Marketella pass: approximately 45%.

The site already has a playful market feel, large type, real photography,
pink/coral/orange gradients, vendor CTAs, event pages, applications, merch,
socials, FAQ, and admin-backed media. It does not yet match the louder
Marketella homepage direction from the PDF.

Implementation note: the first homepage pass added Marketella hero copy, the
brighter client palette, marquee text, butterflies, locations, story content,
homepage Q&A, social links, and podcast teaser.

Second-pass implementation note: the homepage now also includes a two-photo next
market collage, press/link strip, "join the Marketella family" photo-background
section, map/calendar CTA section, "what the f**** is Marketella????" splash,
meet-the-owners placeholder, richer FAQ copy, and split-image podcast treatment.
Remaining work is visual QA, final brand confirmation, real owner/podcast
assets, final social/press URLs, and client-specific copy cleanup.

Site-wide alignment note: public pages beyond the homepage have also been
updated to match the Marketella direction, including route metadata, page hero
copy, public shared header/footer labels, event/application/FAQ/social/merch
language, and a CSS alignment layer for inner-page typography, cards, colors,
and section treatments.

Admin/content note: the new location section is now a client-editable homepage
section. Admins can toggle it, update the rotating phrases, heading, location
name, description, CTA label/link, and bottom rotating text from
`/admin/homepage`. The section's bottom image strip is managed separately in
`/admin/media` as `home.new_location.strip`.

## Client Direction Observed

- Rebrand homepage language from 702Market toward Marketella.
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
- Add a new-location announcement section directly after the hero when the
  client needs to promote Santa Anita or a future market expansion.
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
  brighter Marketella template feel.
- Keep accessibility checks for white text over ombre/photo backgrounds.

Implementation note: the active CSS tokens now use the brighter approximate
palette above.

## Original Gaps

### Homepage Structure

Original homepage sections before the Marketella pass:

- Hero
- Next market
- About
- Gallery
- Vendor CTA
- Merch CTA
- Footer

Client PDF expected a longer homepage:

- Hero with Marketella welcome text
- Rotating phrase band
- Upcoming market / next market section
- Apply-to-sell section
- Press or "same wording" section inspired by 1042 Flea
- Social link section
- Locations section
- About / "what is Marketella?" story section
- What makes Marketella different section
- Meet the owners
- Map/calendar section
- Contact/questions section
- FAQ/Q&A section
- Podcast section

### Tone

Current copy is polished and general. The target voice is more casual, blunt,
founder-led, and intentionally messy/cute. Examples from the PDF include:

- "what the f**** is marketella????"
- "girl, YES."
- "a little chaotic. in a cute way."
- "cute shit."

Use this voice carefully and confirm profanity level before launch.

### Motion

Missing:

- Moving or still butterflies
- Rotating text/marquee bands
- Repeated phrase loops
- More collage/sticker-like layering

### Navigation

Current nav:

- Next market
- About
- Merch
- Socials
- Apply to sell

PDF/reference nav direction:

- Apply 2 Sell
- What is 1042? / What's Marketella?
- Online Store
- Calendar
- FAQ
- Link Tree
- Podcast

## Recommended Implementation Priority

Status: mostly implemented in the first and second homepage passes. Remaining
items are validation, final assets, final links, and visual QA.

1. Rebrand homepage copy and nav to Marketella while preserving existing route
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

The original project scope said 1042 Flea should be inspiration rather than an
exact copy. The newer PDF feedback asks for a much closer adaptation of the
1042 format and energy. Before implementation, confirm whether the desired
direction is:

- Inspired by 1042 but still distinct, or
- Intentionally close to the 1042 homepage structure and tone.
