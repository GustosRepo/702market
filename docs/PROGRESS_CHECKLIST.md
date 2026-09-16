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
- [x] Establish current pink, blush, lilac, and plum visual direction
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

- [ ] Replace homepage placeholder event content with database-driven content
- [x] Display upcoming events
- [x] Display past events automatically
- [x] Add event detail page with date, time, location, deadline, fee, and CTA
- [x] Add responsive vendor application form
- [ ] Validate application fields server-side
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

- [ ] `/admin/login`
- [ ] Protect all `/admin` routes with Supabase Auth
- [ ] Add authorized admin access rules
- [x] Add admin navigation: Dashboard, Events, Applications, Merch
- [x] Add credential-free admin preview shell

### Dashboard

- [x] Show next event summary in preview UI
- [x] Show application and revenue metric placeholders
- [ ] Show live total, pending, approved, waitlisted, and declined applications
- [ ] Show live paid and unpaid application counts
- [ ] Show live revenue for current event, month, and all time
- [ ] Calculate average fee from paid applications
- [ ] Exclude unpaid, failed, waived, and refunded amounts from collected revenue
- [ ] Add loading, empty, and error states

### Events

- [x] Add credential-free event management preview
- [ ] Create event
- [ ] Edit event
- [ ] Publish/unpublish event
- [ ] Upload/change event hero image
- [ ] Enable/disable applications
- [ ] Configure deadline, fee, capacity, and status
- [ ] View event-specific applications

### Applications

- [ ] List applications by event
- [ ] Search by vendor/business/contact
- [ ] Filter by status, category, and payment status
- [ ] Sort by submission date
- [ ] View full application details and product photos
- [ ] Update status to approved, waitlisted, or declined
- [ ] Edit/save internal admin notes
- [ ] Track payment status and reference
- [ ] Export event applications as CSV

### Merch

- [ ] Add product
- [ ] Edit product
- [ ] Archive/delete product
- [ ] Upload product image
- [ ] Set name, description, price, external URL
- [ ] Set active/featured state
- [ ] Set display order

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
- [ ] Verify admin routes reject unauthenticated access
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
