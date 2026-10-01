# 702Market Progress Checklist

Source of truth for V1 delivery. Status: `[x]` complete, `[ ]` not started.

## External Setup Dependencies

These items require client-owned accounts or credentials. The codebase can
continue without them, but the connected workflow cannot be tested until they
are available.

- [ ] Client creates a Supabase project and shares the project URL/key through a secure channel
- [ ] Client creates the admin email/Gmail identity for Supabase Auth
- [ ] Client creates a Resend account and confirms the sending domain/email
- [ ] Apply the SQL migration to the client Supabase project
- [ ] Add local environment values from `.env.example` without committing secrets
- [ ] Verify public submissions, admin login, storage uploads, and transactional email

## Current Milestone: Product Foundation

- [x] Initialize Next.js App Router project with TypeScript, Tailwind, ESLint, and `src/`
- [x] Create responsive 702Market homepage shell
- [x] Establish kawaii Y2K display, accent, and body typography
- [x] Use Cherry Bomb One for headings, DynaPuff for accents, and DM Sans for body text
- [x] Establish current blush, coral pink, peach, orange glow, and berry visual direction
- [x] Add initial homepage sections: hero, next market, about, vendor CTA, merch CTA, footer
- [x] Define separate routes for public content, event details, applications, merch, and admin workflows
- [x] Add shared navigation, socials navigation, and reusable footer primitives
- [ ] Add real events, applications, and merch data models
- [x] Add Supabase client scaffolding and `.env.example` without exposing service credentials
- [x] Prepare initial database migration and Row Level Security policies
- [ ] Connect to the client Supabase project and verify the migration

## Public Website

### Core Routes

- [x] `/`
- [x] `/events` — upcoming and past markets
- [x] `/events/[slug]` — one event's details and vendor CTA
- [x] `/apply` — application entry point and event selection
- [x] `/apply/[eventSlug]` — application for one event
- [x] `/merch` — public merchandise catalog
- [x] `/about` — 702Market story
- [x] `/faq` — common vendor and visitor questions
- [x] `/contact` — contact details and inquiry form
- [x] `/privacy` — privacy policy starter page
- [x] `/terms` — terms starter page
- [x] `/socials` — social links and community page

The homepage promotes these destinations; it should not become the container
for every workflow.

### Public Experience

- [x] Replace homepage placeholder event content with database-driven content
- [x] Display upcoming events
- [x] Display past events automatically
- [x] Add event detail page with date, time, location, deadline, fee, and CTA
- [x] Add responsive vendor application form
- [x] Validate application fields server-side
- [ ] Support 1-5 product image uploads with file type/size restrictions
- [x] Add application success/confirmation state
- [x] Add merch catalog with temporary local product data
- [ ] Link merch products to validated external checkout URLs
- [ ] Add About, FAQ, and Contact pages
- [ ] Add SEO metadata and social sharing metadata
- [x] Add initial accessibility pass: skip link, navigation landmarks, labels, and focus styles
- [x] Add site-wide footer with legal links and CODEWERX credit
- [x] Add Socials page and navigation entry
- [ ] Add mobile and desktop visual QA

## Client Image Assets

Media placement and admin-wiring audit: [`docs/MEDIA_WIRING_PLAN.md`](./MEDIA_WIRING_PLAN.md).

Recommended Supabase Storage buckets:

- [ ] Create `site-assets`
- [ ] Create `event-images`
- [ ] Create `merch-images`
- [ ] Create `application-images`
- [x] Add migration to create recommended Supabase Storage buckets

Current local drop zone while gathering client images: `public/assets/`.

### Site Assets

- [x] Homepage hero/background image — `public/assets/site/home-hero.jpg`
- [x] About/story image — `public/assets/site/about-story.jpg`
- [x] Homepage gallery images — currently local `public/IMG_*.JPG`
- [x] About gallery images — currently local `public/IMG_*.JPG`
- [ ] Social sharing/Open Graph image — `site-assets/seo/og-image.jpg`
- [x] Contact/community sprinkle image — `public/assets/site/contact-community.jpg`
- [x] Social CTA sprinkle image — `public/assets/site/social-cta.jpg`
- [x] New location strip image — currently local `public/IMG_3226.JPG`
- [x] Add `site_media` table or equivalent site media config
- [x] Add admin controls for homepage hero, new location strip, homepage gallery, about gallery, contact image, and socials image
- [ ] Add SEO image slot/admin control
- [x] Replace public homepage/about/contact/social image reads with database/storage-driven media and local fallbacks
- [x] Add upload buttons so admins can choose site media files instead of typing storage/public paths

## Client Rebrand / 1042 Flea Alignment

Reference audit: [`docs/CLIENT_ALIGNMENT_AUDIT.md`](./CLIENT_ALIGNMENT_AUDIT.md).

- [x] Audit current frontend against 1042 Flea reference and client PDF
- [x] Capture final PDF page color direction: bright orange, hot pink, coral red, white/off-white, black, and pink/orange ombre backgrounds
- [ ] Confirm whether the homepage should be 1042-inspired or a close structural adaptation
- [ ] Confirm final public brand name usage: `702Market`, `Marketella`, or transitional `702 Marketella`
- [x] Update homepage nav to include the client-requested destinations: Apply 2 Sell, What's Marketella, Online Store, Calendar, FAQ, Link Tree, Podcast
- [x] Update homepage color tokens toward the final PDF palette
- [x] Add moving or still butterflies throughout the homepage
- [x] Add rotating/marquee text treatments
- [x] Rebuild hero with full-bleed market photo and huge all-caps Marketella welcome text
- [x] Add locations section with image cards, captions, map links, and calendar link
- [x] Add homepage story/about section using the longer Marketella origin copy
- [x] Add homepage Q&A/FAQ section matching the client-provided vendor/customer tone
- [x] Add podcast section for `702 chisme`
- [x] Add Instagram, Facebook, and TikTok links where requested
- [x] Add two-photo next-market collage from the feedback deck
- [x] Add press/link strip for Channel 8, Influence.Vegas, and Fox 5
- [x] Add `join the Marketella family` photo-background section
- [x] Add map and calendar CTA section
- [x] Add `what the f**** is Marketella????` splash section
- [x] Add meet-the-owners placeholder section
- [x] Add split-image treatment to the podcast section
- [x] Add client-reference new location section after the hero
- [x] Make the new location section editable from the admin homepage screen
- [x] Align public route metadata, copy, and styling with the Marketella homepage direction
- [x] Rebrand shared public header/footer/admin labels from 702Market to Marketella where appropriate
- [ ] Run mobile and desktop visual QA for all new homepage sections

### Event Images

- [x] October Night Market hero — `public/assets/events/october-night-market-hero.jpg`
- [x] Pink Pony Pop-Up hero — `public/assets/events/pink-pony-pop-up-hero.jpg`
- [x] Holiday Mini Market hero — `public/assets/events/holiday-mini-market-hero.jpg`
- [x] Sweetheart Swap hero — `public/assets/events/sweetheart-swap-hero.jpg`
- [x] Summer Sidewalk Market archive hero — `public/assets/events/summer-sidewalk-market-hero.jpg`
- [ ] Read `events.hero_image` in public/admin event queries
- [ ] Use `events.hero_image` before local slug fallback
- [ ] Show event thumbnails in admin event list
- [ ] Add event hero upload/change control to event create/edit

### Merch Images

- [ ] 702 Logo Tee product image — `public/assets/merch/702-logo-tee.jpg`
- [ ] Market Day Cap product image — `public/assets/merch/market-day-cap.jpg`
- [ ] Additional product images use `public/assets/merch/{product-slug}.jpg`
- [ ] Read `merch_products.image_path` on the public merch page
- [ ] Show merch thumbnails in admin merch list
- [ ] Replace manual merch image path field with upload/change control

### Vendor/Application Images

- [ ] Confirm max upload count and allowed file types
- [ ] Vendor sample image placeholder — `application-images/examples/vendor-sample-1.jpg`
- [ ] Wire public upload flow before collecting real vendor submission photos
- [ ] Display submitted product photos on admin application detail
- [ ] Add application image count/link to admin application list and CSV export

## Database and Backend

### Tables

- [x] Define `events` migration
- [x] Define `applications` migration
- [x] Define `application_images` migration
- [x] Define `merch_products` migration

### Event Management Data

- [ ] Event title, slug, description, date, times, location, address
- [ ] Hero image and storage path handling
- [ ] Application open date and deadline
- [ ] Application fee, enabled flag, capacity
- [ ] Draft/published status
- [ ] Upcoming/completed/cancelled status
- [ ] Updated timestamps and slug uniqueness

### Application Data

- [ ] Contact and business fields
- [ ] Category, product description, price range
- [ ] Booth type, electricity requirement, special requests
- [ ] Status: pending, approved, waitlisted, declined
- [ ] Payment status: unpaid, paid, waived, refunded
- [ ] Fee, payment reference, paid timestamp
- [ ] Internal admin notes

### Security

- [x] Include Supabase Row Level Security policies in the migration
- [ ] Verify Row Level Security policies in the client project
- [ ] Protect admin-only mutations
- [ ] Keep service-role credentials server-only
- [ ] Allow public application submission only through controlled server routes/actions
- [ ] Restrict storage uploads by file type and size
- [ ] Validate external merchandise URLs
- [ ] Add spam/rate-limit protection to public applications

## Admin Portal

### Authentication and Shell

- [x] `/admin/login`
- [x] Protect all `/admin` routes with Supabase Auth
- [x] Add authorized admin access rules
- [x] Add admin navigation: Dashboard, Homepage, Events, Applications, Merch, Media
- [x] Add credential-free admin preview shell

### Dashboard

- [x] Show next event summary in preview UI
- [x] Show live total, pending, approved, waitlisted, and declined applications
- [x] Show live paid and unpaid application counts
- [ ] Show live revenue for current event, month, and all time
- [ ] Calculate average fee from paid applications
- [x] Exclude unpaid, waived, and refunded amounts from collected revenue
- [ ] Add loading, empty, and error states

### Events

- [x] Add credential-free event management preview
- [x] Create event
- [x] Edit event
- [x] Publish/unpublish event
- [ ] Upload/change event hero image
- [x] Enable/disable applications
- [x] Configure deadline, fee, capacity, and status
- [x] View event-specific applications
- [x] Archive and restore events

### Applications

- [x] List applications grouped by date, event, or status
- [ ] Search by vendor/business/contact
- [x] Filter by status and archive state
- [x] Sort by submission date
- [x] Archive and restore applications
- [ ] Filter by category and payment status
- [x] View full application details
- [ ] View product photos
- [x] Update status to approved, waitlisted, or declined
- [x] Edit/save internal admin notes
- [x] Track payment status and reference
- [x] Export event applications as CSV

### Merch

- [x] Add product
- [x] Edit product
- [x] Archive/delete product
- [ ] Upload product image
- [x] Set name, description, price, external URL
- [x] Set active/featured state
- [x] Set display order

### Media

- [x] Add `/admin/media`
- [x] Manage homepage hero path
- [x] Manage homepage gallery paths, alt text, and captions
- [x] Manage about/story and about gallery paths, alt text, and captions
- [x] Manage contact/community image path
- [x] Manage socials CTA image path
- [x] Add upload controls backed by Supabase Storage for site media
- [ ] Add SEO/Open Graph image control
- [ ] Add event image controls to Event create/edit
- [ ] Add merch image controls to Merch create/edit

## Email Automation

- [ ] Send application received email
- [ ] Send admin new-application notification
- [ ] Send approved status email
- [ ] Send waitlisted status email
- [ ] Send declined status email
- [ ] Add Resend configuration server-side
- [ ] Add React Email templates
- [ ] Avoid duplicate status emails when an unchanged status is saved
- [ ] Log or surface email failures for admins

## Reporting and Operations

- [ ] Revenue by event
- [ ] Revenue by month
- [ ] All-time revenue
- [ ] Paid application count
- [ ] Unpaid application count
- [ ] Average paid application fee
- [ ] CSV columns match the project scope
- [ ] Test revenue calculations for paid, unpaid, waived, refunded, and mixed records

## Quality Gates

- [x] `npm run lint` passes
- [x] `npm run build` passes
- [ ] Add focused tests for revenue calculations
- [ ] Add focused tests for application validation
- [ ] Add tests for status transition/email behavior
- [ ] Verify public routes on mobile and desktop
- [x] Verify admin routes reject unauthenticated access
- [ ] Verify no secret values are exposed to the browser
- [ ] Update README with setup, environment variables, migrations, and run commands

## Explicitly Out of Scope for V1

- [ ] Vendor accounts or vendor dashboards
- [ ] Full CRM
- [ ] Native ecommerce checkout, cart, inventory, shipping, or orders
- [ ] Complex form builder
- [ ] Booth map designer or automated booth assignments
- [ ] QR check-in
- [ ] Full accounting system

## Recommended Next Three Builds

1. **Visual QA pass:** review every public/admin route on mobile and desktop, then refine spacing, text wrapping, focus states, and image treatment.
2. **Pre-connection polish:** replace temporary social destinations with the real handles, finalize merch checkout URLs, and add focused validation tests.
3. **Connected workflow when accounts arrive:** apply the migration, wire form submissions, then add admin authentication, live dashboard data, storage uploads, and email.
