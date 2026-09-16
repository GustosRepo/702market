# 702Market Progress Checklist

Source of truth for V1 delivery. Status: `[x]` complete, `[ ]` not started.

## Current Milestone: Product Foundation

- [x] Initialize Next.js App Router project with TypeScript, Tailwind, ESLint, and `src/`
- [x] Create responsive 702Market homepage shell
- [x] Establish kawaii Y2K display, accent, and body typography
- [x] Use Cherry Bomb One for headings, DynaPuff for accents, and DM Sans for body text
- [x] Establish current pink, blush, lilac, and plum visual direction
- [x] Add initial homepage sections: hero, next market, about, vendor CTA, merch CTA, footer
- [x] Define separate routes for public content, event details, applications, merch, and admin workflows
- [ ] Add shared navigation and reusable button/section primitives
- [ ] Add real events, applications, and merch data models
- [ ] Add Supabase environment/configuration without exposing service credentials
- [ ] Add database migrations and Row Level Security policies

## Public Website

### Core Routes

- [x] `/`
- [ ] `/events` — upcoming and past markets
- [ ] `/events/[slug]` — one event's details and vendor CTA
- [ ] `/apply` — application entry point and event selection
- [ ] `/apply/[eventSlug]` — application for one event
- [ ] `/merch` — public merchandise catalog
- [ ] `/about` — 702Market story
- [ ] `/faq` — common vendor and visitor questions
- [ ] `/contact` — contact details and inquiry form

The homepage promotes these destinations; it should not become the container
for every workflow.

### Public Experience

- [ ] Replace homepage placeholder event content with database-driven content
- [ ] Display upcoming events
- [ ] Display past events automatically
- [ ] Add event detail page with date, time, location, deadline, fee, and CTA
- [ ] Add responsive vendor application form
- [ ] Validate application fields server-side
- [ ] Support 1-5 product image uploads with file type/size restrictions
- [ ] Add application success/confirmation state
- [ ] Add merch catalog with active/featured ordering
- [ ] Link merch products to validated external checkout URLs
- [ ] Add About, FAQ, and Contact pages
- [ ] Add SEO metadata and social sharing metadata
- [ ] Add accessibility pass: keyboard navigation, labels, contrast, alt text
- [ ] Add mobile and desktop visual QA

## Database and Backend

### Tables

- [ ] `events`
- [ ] `applications`
- [ ] `application_images`
- [ ] `merch_products`

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

- [ ] Enable Supabase Row Level Security
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
- [ ] Add admin navigation: Dashboard, Events, Applications, Merch, Reports, Settings

### Dashboard

- [ ] Show next event summary
- [ ] Show total, pending, approved, waitlisted, and declined applications
- [ ] Show paid and unpaid application counts
- [ ] Show revenue for current event, month, and all time
- [ ] Calculate average fee from paid applications
- [ ] Exclude unpaid, failed, waived, and refunded amounts from collected revenue
- [ ] Add loading, empty, and error states

### Events

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

1. **Supabase foundation:** schema, migrations, RLS, server client, and typed models.
2. **Events vertical slice:** admin event creation plus public `/events` and `/events/[slug]` pages.
3. **Applications vertical slice:** public `/apply` and `/apply/[eventSlug]` pages with image uploads, validation, and persisted submissions.
